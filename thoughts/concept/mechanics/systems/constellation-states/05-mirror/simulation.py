#!/usr/bin/env python3
"""
Constellation States Simulation

Validates the mechanics from 02-blood.md by simulating user journeys
and checking if progression feels right.

Usage:
    python simulation.py              # Run all scenarios
    python simulation.py --scenario ideal  # Run specific scenario
    python simulation.py --chart      # Generate charts
"""

import argparse
from dataclasses import dataclass, field
from enum import Enum
from typing import List, Optional
import json

# =============================================================================
# CONSTANTS (from 02-blood.md)
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

# Impacts
BASE_EXPERIMENT_IMPACT = 0.08
MAX_DAILY_IMPACT = 0.15
INSIGHT_IMPACT = 0.06
CONNECTION_IMPACT = 0.04

# Penalties
BASE_SKIP_PENALTY = 0.02
CONTRADICTION_PENALTY = 0.10

# Decay half-lives by domain
HALF_LIVES = {
    "health": 7,
    "relationships": 14,
    "purpose": 30,
    "wealth": 21,
    "soul": 90,
}

# Streak
MAX_STREAK_BONUS = 1.5

# Dark star
DARK_STAR_DRAIN_RATE = 0.03
INTEGRATION_THRESHOLD = 1.0

# Spillover
SPILLOVER_RATE = 0.3

# Dormancy thresholds
DORMANCY_THRESHOLDS = {
    "nascent": 14,
    "flickering": 14,
    "dim": 30,
    "bright": 60,
    "dark": 30,
}

# Difficulty multipliers
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
    """Actions taken on a single day"""
    experiments_completed: int = 0
    experiments_skipped: int = 0
    difficulty: str = "medium"
    insight_gained: bool = False
    contradiction_detected: bool = False


# =============================================================================
# CORE MECHANICS
# =============================================================================

def clamp(value: float, min_val: float, max_val: float) -> float:
    """Clamp value to range"""
    return max(min_val, min(max_val, value))


def calculate_daily_decay_rate(half_life: int) -> float:
    """Convert half-life to daily decay rate"""
    return 1 - (0.5 ** (1 / half_life))


def calculate_streak_bonus(streak_days: int) -> float:
    """Calculate streak multiplier"""
    bonus = 1 + (streak_days * 0.05)
    return min(bonus, MAX_STREAK_BONUS)


def calculate_skip_modifier(consecutive_skips: int) -> float:
    """Calculate skip penalty modifier based on pattern"""
    if consecutive_skips <= 1:
        return 1.0
    elif consecutive_skips == 2:
        return 1.5
    else:
        return 2.0


def update_variance(star: Star, new_brightness: float) -> float:
    """Update variance using exponential moving average"""
    if len(star.brightness_history) == 0:
        return 0.0

    delta = abs(new_brightness - star.brightness)
    new_variance = (
        VARIANCE_SMOOTHING_FACTOR * delta +
        (1 - VARIANCE_SMOOTHING_FACTOR) * star.variance
    )
    return clamp(new_variance, 0, 1)


def determine_state(star: Star) -> State:
    """Determine star state based on brightness, variance, and history"""
    b = star.brightness
    v = star.variance

    # Dormancy check
    dormancy_threshold = DORMANCY_THRESHOLDS.get(star.state.value, 30)
    if star.days_inactive >= dormancy_threshold:
        return State.DORMANT

    # Dark star check
    if star.is_dark_candidate and star.contradiction_count >= 3:
        return State.DARK

    # Variance-based flickering
    if v > VARIANCE_THRESHOLD_HIGH:
        return State.FLICKERING

    # Brightness-based states (require stabilization)
    if b >= BRIGHTNESS_THRESHOLD_BRIGHT and star.days_stable >= STABILIZATION_DAYS:
        return State.BRIGHT

    if b < BRIGHTNESS_THRESHOLD_DIM and star.days_stable >= STABILIZATION_DAYS:
        return State.DIM

    # Default to flickering if not stable enough
    return State.FLICKERING


def simulate_day(star: Star, action: DayAction, consecutive_skips: int = 0) -> Star:
    """Simulate one day of star evolution"""

    # Calculate positive impacts
    positive = 0.0

    if action.experiments_completed > 0:
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

    # Calculate decay
    half_life = HALF_LIVES.get(star.domain, 14)
    decay_rate = calculate_daily_decay_rate(half_life)
    decay = star.brightness * decay_rate if action.experiments_completed == 0 else 0

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
    if action.experiments_completed > 0:
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
    random.seed(42)  # Reproducible

    for day in range(days):
        # 30% completion rate
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
    """User engages for 2 weeks, then disappears for 3 months"""
    star = Star(name="Purpose", domain="purpose", brightness=0.3)
    results = []

    for day in range(days):
        if day < 14:
            # Active phase
            action = DayAction(experiments_completed=1, difficulty="medium")
        else:
            # Absent phase
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


def scenario_gaming_attempt(days: int = 7) -> List[dict]:
    """User tries to game by doing 10 experiments per day"""
    star = Star(name="Health", domain="health", brightness=0.3)
    results = []

    for day in range(days):
        # Gaming: 10 tiny experiments per day
        action = DayAction(experiments_completed=10, difficulty="tiny")
        star = simulate_day(star, action)

        results.append({
            "day": day + 1,
            "brightness": round(star.brightness, 3),
            "variance": round(star.variance, 3),
            "state": star.state.value,
            "note": f"10 tiny experiments, capped at {MAX_DAILY_IMPACT}",
        })

    return results


def scenario_dark_star_drain(days: int = 30) -> List[dict]:
    """Bright star connected to dark star - shows energy drain"""
    bright_star = Star(name="Purpose", domain="purpose", brightness=0.8, state=State.BRIGHT)
    dark_star = Star(name="Fear", domain="soul", brightness=0.2, state=State.DARK)

    results = []
    connection_strength = 0.7

    for day in range(days):
        # Bright star does nothing (just maintenance)
        action = DayAction()
        bright_star = simulate_day(bright_star, action)

        # Apply dark star drain
        dark_intensity = 1 - dark_star.brightness
        drain = DARK_STAR_DRAIN_RATE * connection_strength * dark_intensity
        bright_star.brightness = clamp(
            bright_star.brightness - drain,
            MIN_BRIGHTNESS,
            MAX_BRIGHTNESS
        )

        results.append({
            "day": day + 1,
            "bright_star_brightness": round(bright_star.brightness, 3),
            "drain_applied": round(drain, 4),
            "cumulative_drain": round(drain * (day + 1), 3),
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
    """Analyze scenario results"""
    brightnesses = [r.get("brightness", r.get("bright_star_brightness", 0)) for r in results]

    analysis = {
        "scenario": name,
        "days": len(results),
        "start_brightness": brightnesses[0],
        "end_brightness": brightnesses[-1],
        "max_brightness": max(brightnesses),
        "min_brightness": min(brightnesses),
        "final_state": results[-1].get("state", "N/A"),
    }

    # Find key milestones
    for i, b in enumerate(brightnesses):
        if b >= BRIGHTNESS_THRESHOLD_BRIGHT and "day_reached_bright" not in analysis:
            analysis["day_reached_bright"] = i + 1
        if b >= BRIGHTNESS_THRESHOLD_DIM and "day_reached_dim" not in analysis:
            analysis["day_reached_dim"] = i + 1

    return analysis


def print_results(name: str, results: List[dict], analysis: dict):
    """Print formatted results"""
    print(f"\n{'='*60}")
    print(f"SCENARIO: {name}")
    print(f"{'='*60}")

    # Print first 7 days and last 3 days
    print("\nDay-by-day (first 7 + last 3):")
    print("-" * 50)

    for r in results[:7]:
        print(f"  Day {r['day']:2d}: brightness={r.get('brightness', r.get('bright_star_brightness', 'N/A')):.3f}, state={r.get('state', 'N/A')}")

    if len(results) > 10:
        print("  ...")

    for r in results[-3:]:
        print(f"  Day {r['day']:2d}: brightness={r.get('brightness', r.get('bright_star_brightness', 'N/A')):.3f}, state={r.get('state', 'N/A')}")

    print("\nAnalysis:")
    print("-" * 50)
    for key, value in analysis.items():
        if key != "scenario":
            print(f"  {key}: {value}")


def generate_ascii_chart(results: List[dict], width: int = 50):
    """Generate simple ASCII chart of brightness over time"""
    brightnesses = [r.get("brightness", r.get("bright_star_brightness", 0)) for r in results]

    print("\nBrightness over time:")
    print("-" * (width + 10))

    # Thresholds
    bright_pos = int(BRIGHTNESS_THRESHOLD_BRIGHT * width)
    dim_pos = int(BRIGHTNESS_THRESHOLD_DIM * width)

    for i, b in enumerate(brightnesses[::max(1, len(brightnesses)//20)]):  # Sample ~20 points
        bar_len = int(b * width)
        bar = "█" * bar_len

        # Add threshold markers
        line = list(" " * width)
        line[bright_pos] = "|"
        line[dim_pos] = "|"

        day = i * max(1, len(brightnesses)//20) + 1
        print(f"Day {day:3d} [{bar:<{width}}] {b:.2f}")

    print(f"         {' '*dim_pos}↑{' '*(bright_pos-dim_pos-1)}↑")
    print(f"         {' '*dim_pos}DIM{' '*(bright_pos-dim_pos-3)}BRIGHT")


# =============================================================================
# MAIN
# =============================================================================

def main():
    parser = argparse.ArgumentParser(description="Constellation States Simulation")
    parser.add_argument("--scenario", type=str, help="Run specific scenario")
    parser.add_argument("--chart", action="store_true", help="Show ASCII charts")
    parser.add_argument("--json", action="store_true", help="Output raw JSON")
    args = parser.parse_args()

    scenarios = {
        "ideal": ("Ideal User (daily engagement)", scenario_ideal_user),
        "struggling": ("Struggling User (30% completion)", scenario_struggling_user),
        "absent": ("Absent User (2 weeks then gone)", scenario_absent_user),
        "gaming": ("Gaming Attempt (10 tiny/day)", scenario_gaming_attempt),
        "dark_drain": ("Dark Star Drain Effect", scenario_dark_star_drain),
        "recovery": ("Recovery from Low", scenario_recovery),
    }

    if args.scenario:
        if args.scenario not in scenarios:
            print(f"Unknown scenario: {args.scenario}")
            print(f"Available: {', '.join(scenarios.keys())}")
            return

        name, func = scenarios[args.scenario]
        results = func()
        analysis = analyze_scenario(name, results)

        if args.json:
            print(json.dumps({"results": results, "analysis": analysis}, indent=2))
        else:
            print_results(name, results, analysis)
            if args.chart:
                generate_ascii_chart(results)
    else:
        # Run all scenarios
        print("="*60)
        print("CONSTELLATION STATES SIMULATION")
        print("Validating mechanics from 02-blood.md")
        print("="*60)

        all_analyses = []

        for key, (name, func) in scenarios.items():
            results = func()
            analysis = analyze_scenario(name, results)
            all_analyses.append(analysis)

            if not args.json:
                print_results(name, results, analysis)
                if args.chart:
                    generate_ascii_chart(results)

        if args.json:
            print(json.dumps(all_analyses, indent=2))
        else:
            # Summary
            print("\n" + "="*60)
            print("SUMMARY")
            print("="*60)

            print("\n| Scenario | Days to BRIGHT | Final Brightness | Final State |")
            print("|----------|----------------|------------------|-------------|")
            for a in all_analyses:
                days_bright = a.get("day_reached_bright", "N/A")
                print(f"| {a['scenario'][:30]:<30} | {str(days_bright):^14} | {a['end_brightness']:^16.3f} | {a['final_state']:^11} |")

            print("\n" + "="*60)
            print("VALIDATION CHECKLIST")
            print("="*60)

            ideal = all_analyses[0]
            gaming = all_analyses[3]

            checks = [
                ("Ideal user reaches BRIGHT in ~14 days",
                 10 <= ideal.get("day_reached_bright", 0) <= 18),
                ("Gaming attempt is capped (not instant BRIGHT)",
                 gaming.get("day_reached_bright", 999) > 3),
                ("Struggling user still makes progress",
                 all_analyses[1]["end_brightness"] > 0.3),
                ("Absent user decays but doesn't hit 0",
                 all_analyses[2]["end_brightness"] >= MIN_BRIGHTNESS),
                ("Dark star drain is noticeable but not instant",
                 0.3 < all_analyses[4]["end_brightness"] < 0.7),
            ]

            for check, passed in checks:
                status = "✓ PASS" if passed else "✗ FAIL"
                print(f"  {status}: {check}")


if __name__ == "__main__":
    main()
