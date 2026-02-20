#!/usr/bin/env python3
"""
Constellation States Simulation - V2 (Tuned)

After initial simulation revealed issues:
- Progression too fast (5 days to BRIGHT, want 14)
- Gaming too effective
- Struggling users decline (want slow progress)
- Dark star drain too aggressive

TUNING CHANGES:
1. Reduced BASE_EXPERIMENT_IMPACT: 0.08 → 0.04
2. Reduced MAX_DAILY_IMPACT: 0.15 → 0.08
3. Reduced BASE_SKIP_PENALTY: 0.02 → 0.01
4. Reduced DARK_STAR_DRAIN_RATE: 0.03 → 0.015
5. Added decay immunity when engaged
"""

from dataclasses import dataclass, field
from enum import Enum
from typing import List
import json

# =============================================================================
# TUNED CONSTANTS (V2)
# =============================================================================

# Brightness
MIN_BRIGHTNESS = 0.05
MAX_BRIGHTNESS = 1.0
BRIGHTNESS_THRESHOLD_BRIGHT = 0.7
BRIGHTNESS_THRESHOLD_DIM = 0.5

# Variance
VARIANCE_THRESHOLD_HIGH = 0.15
VARIANCE_THRESHOLD_LOW = 0.05
VARIANCE_SMOOTHING_FACTOR = 0.3

# Time
STABILIZATION_DAYS = 7

# TUNED: Impacts reduced
BASE_EXPERIMENT_IMPACT = 0.04  # Was 0.08
MAX_DAILY_IMPACT = 0.08        # Was 0.15
INSIGHT_IMPACT = 0.03          # Was 0.06
CONNECTION_IMPACT = 0.02       # Was 0.04

# TUNED: Penalties reduced
BASE_SKIP_PENALTY = 0.01       # Was 0.02
CONTRADICTION_PENALTY = 0.05   # Was 0.10

# Decay half-lives by domain (unchanged)
HALF_LIVES = {
    "health": 7,
    "relationships": 14,
    "purpose": 30,
    "wealth": 21,
    "soul": 90,
}

# Streak (unchanged)
MAX_STREAK_BONUS = 1.5

# TUNED: Dark star drain reduced
DARK_STAR_DRAIN_RATE = 0.015  # Was 0.03

# Spillover (unchanged)
SPILLOVER_RATE = 0.3

# Dormancy thresholds (unchanged)
DORMANCY_THRESHOLDS = {
    "nascent": 14,
    "flickering": 14,
    "dim": 30,
    "bright": 60,
    "dark": 30,
}

# Difficulty multipliers (unchanged)
DIFFICULTY_MULTIPLIERS = {
    "tiny": 0.5,
    "small": 0.75,
    "medium": 1.0,
    "stretch": 1.5,
}


# =============================================================================
# ENUMS AND DATA CLASSES
# =============================================================================

class State(Enum):
    NASCENT = "nascent"
    FLICKERING = "flickering"
    DIM = "dim"
    BRIGHT = "bright"
    DARK = "dark"
    DORMANT = "dormant"


@dataclass
class Star:
    name: str
    domain: str = "health"
    brightness: float = 0.3
    variance: float = 0.15
    state: State = State.FLICKERING
    days_stable: int = 0
    days_inactive: int = 0
    streak_days: int = 0
    contradiction_count: int = 0
    is_dark_candidate: bool = False
    brightness_history: List[float] = field(default_factory=list)

    def __post_init__(self):
        self.brightness_history = [self.brightness]


@dataclass
class DayAction:
    experiments_completed: int = 0
    experiments_skipped: int = 0
    difficulty: str = "medium"
    insight_gained: bool = False
    contradiction_detected: bool = False


# =============================================================================
# CORE MECHANICS
# =============================================================================

def clamp(value: float, min_val: float, max_val: float) -> float:
    return max(min_val, min(max_val, value))


def calculate_daily_decay_rate(half_life: int) -> float:
    return 1 - (0.5 ** (1 / half_life))


def calculate_streak_bonus(streak_days: int) -> float:
    bonus = 1 + (streak_days * 0.03)  # Reduced from 0.05
    return min(bonus, MAX_STREAK_BONUS)


def calculate_skip_modifier(consecutive_skips: int) -> float:
    if consecutive_skips <= 1:
        return 1.0
    elif consecutive_skips == 2:
        return 1.5
    else:
        return 2.0


def update_variance(star: Star, new_brightness: float) -> float:
    if len(star.brightness_history) == 0:
        return 0.0
    delta = abs(new_brightness - star.brightness)
    new_variance = (
        VARIANCE_SMOOTHING_FACTOR * delta +
        (1 - VARIANCE_SMOOTHING_FACTOR) * star.variance
    )
    return clamp(new_variance, 0, 1)


def determine_state(star: Star) -> State:
    b = star.brightness
    v = star.variance

    dormancy_threshold = DORMANCY_THRESHOLDS.get(star.state.value, 30)
    if star.days_inactive >= dormancy_threshold:
        return State.DORMANT

    if star.is_dark_candidate and star.contradiction_count >= 3:
        return State.DARK

    if v > VARIANCE_THRESHOLD_HIGH:
        return State.FLICKERING

    if b >= BRIGHTNESS_THRESHOLD_BRIGHT and star.days_stable >= STABILIZATION_DAYS:
        return State.BRIGHT

    if b < BRIGHTNESS_THRESHOLD_DIM and star.days_stable >= STABILIZATION_DAYS:
        return State.DIM

    return State.FLICKERING


def simulate_day(star: Star, action: DayAction, consecutive_skips: int = 0) -> Star:
    """Simulate one day - V2 with tuned mechanics"""

    # Calculate positive impacts
    positive = 0.0
    engaged_today = action.experiments_completed > 0

    if engaged_today:
        difficulty_mult = DIFFICULTY_MULTIPLIERS.get(action.difficulty, 1.0)
        streak_bonus = calculate_streak_bonus(star.streak_days)

        for _ in range(action.experiments_completed):
            impact = BASE_EXPERIMENT_IMPACT * difficulty_mult * streak_bonus
            positive += impact

    if action.insight_gained:
        positive += INSIGHT_IMPACT

    # Cap positive impacts
    positive = min(positive, MAX_DAILY_IMPACT)

    # Calculate negative impacts
    negative = 0.0

    if action.experiments_skipped > 0:
        skip_modifier = calculate_skip_modifier(consecutive_skips)
        negative += BASE_SKIP_PENALTY * skip_modifier * action.experiments_skipped

    if action.contradiction_detected:
        negative += CONTRADICTION_PENALTY
        star.contradiction_count += 1

    # V2 CHANGE: Only apply decay if NOT engaged today
    decay = 0
    if not engaged_today:
        half_life = HALF_LIVES.get(star.domain, 14)
        decay_rate = calculate_daily_decay_rate(half_life)
        decay = star.brightness * decay_rate

    # Update brightness
    new_brightness = clamp(
        star.brightness + positive - negative - decay,
        MIN_BRIGHTNESS,
        MAX_BRIGHTNESS
    )

    # Update variance
    star.variance = update_variance(star, new_brightness)
    star.brightness = new_brightness
    star.brightness_history.append(new_brightness)

    # Update counters
    if engaged_today:
        star.streak_days += 1
        star.days_inactive = 0
    else:
        star.streak_days = 0
        star.days_inactive += 1

    # Check stability
    if star.variance < VARIANCE_THRESHOLD_LOW:
        star.days_stable += 1
    else:
        star.days_stable = 0

    # Update state
    star.state = determine_state(star)

    return star


# =============================================================================
# SCENARIOS
# =============================================================================

def scenario_ideal_user(days: int = 30) -> List[dict]:
    """Ideal user: completes experiment every day"""
    star = Star(name="Health", domain="health", brightness=0.3)
    results = []

    for day in range(days):
        action = DayAction(experiments_completed=1, difficulty="medium")
        star = simulate_day(star, action)
        results.append({
            "day": day + 1,
            "brightness": round(star.brightness, 3),
            "variance": round(star.variance, 3),
            "state": star.state.value,
            "streak": star.streak_days,
        })

    return results


def scenario_struggling_user(days: int = 30) -> List[dict]:
    """Struggling user: completes ~30% of experiments"""
    star = Star(name="Health", domain="health", brightness=0.3)
    results = []
    consecutive_skips = 0

    import random
    random.seed(42)

    for day in range(days):
        if random.random() < 0.3:
            action = DayAction(experiments_completed=1, difficulty="small")
            consecutive_skips = 0
        else:
            action = DayAction(experiments_skipped=1)
            consecutive_skips += 1

        star = simulate_day(star, action, consecutive_skips)
        results.append({
            "day": day + 1,
            "brightness": round(star.brightness, 3),
            "variance": round(star.variance, 3),
            "state": star.state.value,
            "streak": star.streak_days,
        })

    return results


def scenario_absent_user(days: int = 90) -> List[dict]:
    """User engages for 2 weeks, then disappears"""
    star = Star(name="Purpose", domain="purpose", brightness=0.3)
    results = []

    for day in range(days):
        if day < 14:
            action = DayAction(experiments_completed=1, difficulty="medium")
        else:
            action = DayAction()

        star = simulate_day(star, action)
        results.append({
            "day": day + 1,
            "brightness": round(star.brightness, 3),
            "variance": round(star.variance, 3),
            "state": star.state.value,
            "days_inactive": star.days_inactive,
        })

    return results


def scenario_gaming_attempt(days: int = 14) -> List[dict]:
    """User tries to game by doing 10 experiments per day"""
    star = Star(name="Health", domain="health", brightness=0.3)
    results = []

    for day in range(days):
        action = DayAction(experiments_completed=10, difficulty="tiny")
        star = simulate_day(star, action)
        results.append({
            "day": day + 1,
            "brightness": round(star.brightness, 3),
            "state": star.state.value,
        })

    return results


def scenario_dark_star_drain(days: int = 60) -> List[dict]:
    """Bright star connected to dark star - V2 with reduced drain"""
    bright_star = Star(name="Purpose", domain="purpose", brightness=0.8, state=State.BRIGHT)
    dark_star = Star(name="Fear", domain="soul", brightness=0.2, state=State.DARK)

    results = []
    connection_strength = 0.7

    for day in range(days):
        action = DayAction()
        bright_star = simulate_day(bright_star, action)

        # Apply dark star drain (V2: reduced rate)
        dark_intensity = 1 - dark_star.brightness
        drain = DARK_STAR_DRAIN_RATE * connection_strength * dark_intensity
        bright_star.brightness = clamp(
            bright_star.brightness - drain,
            MIN_BRIGHTNESS,
            MAX_BRIGHTNESS
        )

        results.append({
            "day": day + 1,
            "brightness": round(bright_star.brightness, 3),
            "drain_applied": round(drain, 4),
        })

    return results


def scenario_recovery(days: int = 60) -> List[dict]:
    """User at low brightness recovers through consistent effort"""
    star = Star(name="Health", domain="health", brightness=0.15, state=State.DIM)
    results = []

    for day in range(days):
        action = DayAction(experiments_completed=1, difficulty="small")
        star = simulate_day(star, action)
        results.append({
            "day": day + 1,
            "brightness": round(star.brightness, 3),
            "state": star.state.value,
            "streak": star.streak_days,
            "days_stable": star.days_stable,
        })

    return results


# =============================================================================
# ANALYSIS
# =============================================================================

def analyze_scenario(name: str, results: List[dict]) -> dict:
    brightnesses = [r.get("brightness", 0) for r in results]

    analysis = {
        "scenario": name,
        "days": len(results),
        "start_brightness": brightnesses[0],
        "end_brightness": brightnesses[-1],
        "max_brightness": max(brightnesses),
        "min_brightness": min(brightnesses),
        "final_state": results[-1].get("state", "N/A"),
    }

    for i, b in enumerate(brightnesses):
        if b >= BRIGHTNESS_THRESHOLD_BRIGHT and "day_reached_bright" not in analysis:
            analysis["day_reached_bright"] = i + 1
        if b >= BRIGHTNESS_THRESHOLD_DIM and "day_reached_dim" not in analysis:
            analysis["day_reached_dim"] = i + 1

    return analysis


def print_results(name: str, results: List[dict], analysis: dict):
    print(f"\n{'='*60}")
    print(f"SCENARIO: {name}")
    print(f"{'='*60}")

    print("\nProgression (sampled):")
    print("-" * 50)

    # Sample days to show
    sample_days = [0, 6, 13, 20, 29] if len(results) >= 30 else list(range(min(10, len(results))))
    if len(results) > 30:
        sample_days.extend([len(results)-1])

    for i in sample_days:
        if i < len(results):
            r = results[i]
            print(f"  Day {r['day']:2d}: brightness={r.get('brightness', 'N/A'):.3f}, state={r.get('state', 'N/A')}")

    print(f"\nAnalysis:")
    print("-" * 50)
    for key, value in analysis.items():
        if key != "scenario":
            print(f"  {key}: {value}")


def main():
    print("="*60)
    print("CONSTELLATION STATES SIMULATION - V2 (TUNED)")
    print("="*60)
    print("\nTuning changes from V1:")
    print("  - BASE_EXPERIMENT_IMPACT: 0.08 → 0.04")
    print("  - MAX_DAILY_IMPACT: 0.15 → 0.08")
    print("  - BASE_SKIP_PENALTY: 0.02 → 0.01")
    print("  - DARK_STAR_DRAIN_RATE: 0.03 → 0.015")
    print("  - No decay when engaged (engagement protects)")

    scenarios = {
        "ideal": ("Ideal User (daily engagement)", scenario_ideal_user),
        "struggling": ("Struggling User (30% completion)", scenario_struggling_user),
        "absent": ("Absent User (2 weeks then gone)", scenario_absent_user),
        "gaming": ("Gaming Attempt (10 tiny/day)", scenario_gaming_attempt),
        "dark_drain": ("Dark Star Drain (60 days)", scenario_dark_star_drain),
        "recovery": ("Recovery from Low", scenario_recovery),
    }

    all_analyses = []

    for key, (name, func) in scenarios.items():
        results = func()
        analysis = analyze_scenario(name, results)
        all_analyses.append(analysis)
        print_results(name, results, analysis)

    # Summary
    print("\n" + "="*60)
    print("SUMMARY - V2")
    print("="*60)

    print("\n| Scenario | Days to BRIGHT | Final Brightness | Final State |")
    print("|----------|----------------|------------------|-------------|")
    for a in all_analyses:
        days_bright = a.get("day_reached_bright", "N/A")
        print(f"| {a['scenario'][:30]:<30} | {str(days_bright):^14} | {a['end_brightness']:^16.3f} | {a['final_state']:^11} |")

    print("\n" + "="*60)
    print("VALIDATION CHECKLIST - V2")
    print("="*60)

    ideal = all_analyses[0]
    gaming = all_analyses[3]
    struggling = all_analyses[1]
    absent = all_analyses[2]
    dark = all_analyses[4]

    checks = [
        ("Ideal user reaches BRIGHT in 10-18 days",
         10 <= ideal.get("day_reached_bright", 0) <= 18,
         f"Got: {ideal.get('day_reached_bright', 'N/A')} days"),

        ("Gaming is slowed (BRIGHT in 7+ days)",
         gaming.get("day_reached_bright", 999) >= 7,
         f"Got: {gaming.get('day_reached_bright', 'N/A')} days"),

        ("Struggling user maintains or grows",
         struggling["end_brightness"] >= struggling["start_brightness"] * 0.8,
         f"Start: {struggling['start_brightness']:.2f}, End: {struggling['end_brightness']:.2f}"),

        ("Absent user decays but doesn't hit 0",
         absent["end_brightness"] >= MIN_BRIGHTNESS + 0.05,
         f"End: {absent['end_brightness']:.2f}"),

        ("Dark star drain is gradual (>0.3 at day 60)",
         dark["end_brightness"] > 0.3,
         f"End: {dark['end_brightness']:.2f}"),

        ("Recovery from low is possible",
         all_analyses[5].get("day_reached_bright", 999) <= 30,
         f"Got: {all_analyses[5].get('day_reached_bright', 'N/A')} days"),
    ]

    passed = 0
    for check, result, detail in checks:
        status = "✓ PASS" if result else "✗ FAIL"
        if result:
            passed += 1
        print(f"  {status}: {check}")
        print(f"         {detail}")

    print(f"\n  Score: {passed}/{len(checks)} checks passed")


if __name__ == "__main__":
    main()
