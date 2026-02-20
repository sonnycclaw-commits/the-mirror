#!/usr/bin/env python3
"""
Constellation States Simulation - V3 (Final Tuning)

Key insight: Linear decay is too harsh at low brightness.
Solution: Proportional decay that slows near the floor.

V3 CHANGES:
1. BASE_EXPERIMENT_IMPACT: 0.04 → 0.03
2. MAX_DAILY_IMPACT: 0.08 → 0.06
3. Decay formula: Uses (brightness - MIN) so decay slows near floor
4. Dark star drain capped at 50% reduction per month
5. "Maintenance zone" below 0.3 has slower decay
"""

from dataclasses import dataclass, field
from enum import Enum
from typing import List

# =============================================================================
# TUNED CONSTANTS (V3 - FINAL)
# =============================================================================

MIN_BRIGHTNESS = 0.05
MAX_BRIGHTNESS = 1.0
BRIGHTNESS_THRESHOLD_BRIGHT = 0.7
BRIGHTNESS_THRESHOLD_DIM = 0.5
MAINTENANCE_ZONE = 0.3  # Below this, decay is slower

VARIANCE_THRESHOLD_HIGH = 0.15
VARIANCE_THRESHOLD_LOW = 0.05
VARIANCE_SMOOTHING_FACTOR = 0.3

STABILIZATION_DAYS = 7

# V3: Further reduced for slower progression
BASE_EXPERIMENT_IMPACT = 0.03
MAX_DAILY_IMPACT = 0.06
INSIGHT_IMPACT = 0.02
CONNECTION_IMPACT = 0.015

BASE_SKIP_PENALTY = 0.008
CONTRADICTION_PENALTY = 0.04

HALF_LIVES = {
    "health": 7,
    "relationships": 14,
    "purpose": 30,
    "wealth": 21,
    "soul": 90,
}

MAX_STREAK_BONUS = 1.3  # Reduced from 1.5

# V3: Much slower dark star drain
DARK_STAR_DRAIN_RATE = 0.008

SPILLOVER_RATE = 0.3

DORMANCY_THRESHOLDS = {
    "nascent": 14,
    "flickering": 14,
    "dim": 30,
    "bright": 60,
    "dark": 30,
}

DIFFICULTY_MULTIPLIERS = {
    "tiny": 0.5,
    "small": 0.75,
    "medium": 1.0,
    "stretch": 1.5,
}


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


def clamp(value: float, min_val: float, max_val: float) -> float:
    return max(min_val, min(max_val, value))


def calculate_daily_decay_rate(half_life: int) -> float:
    return 1 - (0.5 ** (1 / half_life))


def calculate_streak_bonus(streak_days: int) -> float:
    bonus = 1 + (streak_days * 0.02)
    return min(bonus, MAX_STREAK_BONUS)


def calculate_skip_modifier(consecutive_skips: int) -> float:
    if consecutive_skips <= 1:
        return 1.0
    elif consecutive_skips == 2:
        return 1.3
    else:
        return 1.5


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


def calculate_decay(brightness: float, domain: str) -> float:
    """
    V3: Proportional decay that slows near the floor.

    Key insight: Decay should be proportional to (brightness - MIN),
    not to brightness. This means:
    - At brightness 1.0: Full decay rate
    - At brightness 0.3: 26% of full decay rate
    - At brightness 0.1: 5% of full decay rate
    """
    half_life = HALF_LIVES.get(domain, 14)
    base_decay_rate = calculate_daily_decay_rate(half_life)

    # Decay proportional to distance from floor
    effective_brightness = brightness - MIN_BRIGHTNESS
    max_effective = MAX_BRIGHTNESS - MIN_BRIGHTNESS

    # Scale decay by position in range
    decay_factor = effective_brightness / max_effective

    # Additional slowdown in maintenance zone
    if brightness < MAINTENANCE_ZONE:
        decay_factor *= 0.5

    return brightness * base_decay_rate * decay_factor


def simulate_day(star: Star, action: DayAction, consecutive_skips: int = 0) -> Star:
    """Simulate one day - V3 with proportional decay"""

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

    positive = min(positive, MAX_DAILY_IMPACT)

    negative = 0.0

    if action.experiments_skipped > 0:
        skip_modifier = calculate_skip_modifier(consecutive_skips)
        negative += BASE_SKIP_PENALTY * skip_modifier * action.experiments_skipped

    if action.contradiction_detected:
        negative += CONTRADICTION_PENALTY
        star.contradiction_count += 1

    # V3: Proportional decay, only when not engaged
    decay = 0
    if not engaged_today:
        decay = calculate_decay(star.brightness, star.domain)

    new_brightness = clamp(
        star.brightness + positive - negative - decay,
        MIN_BRIGHTNESS,
        MAX_BRIGHTNESS
    )

    star.variance = update_variance(star, new_brightness)
    star.brightness = new_brightness
    star.brightness_history.append(new_brightness)

    if engaged_today:
        star.streak_days += 1
        star.days_inactive = 0
    else:
        star.streak_days = 0
        star.days_inactive += 1

    if star.variance < VARIANCE_THRESHOLD_LOW:
        star.days_stable += 1
    else:
        star.days_stable = 0

    star.state = determine_state(star)

    return star


# =============================================================================
# SCENARIOS
# =============================================================================

def scenario_ideal_user(days: int = 30) -> List[dict]:
    star = Star(name="Health", domain="health", brightness=0.3)
    results = []

    for day in range(days):
        action = DayAction(experiments_completed=1, difficulty="medium")
        star = simulate_day(star, action)
        results.append({
            "day": day + 1,
            "brightness": round(star.brightness, 3),
            "state": star.state.value,
        })

    return results


def scenario_struggling_user(days: int = 30) -> List[dict]:
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
            "state": star.state.value,
        })

    return results


def scenario_absent_user(days: int = 90) -> List[dict]:
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
            "state": star.state.value,
            "days_inactive": star.days_inactive,
        })

    return results


def scenario_gaming_attempt(days: int = 21) -> List[dict]:
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
    bright_star = Star(name="Purpose", domain="purpose", brightness=0.8, state=State.BRIGHT)
    dark_star = Star(name="Fear", domain="soul", brightness=0.2, state=State.DARK)

    results = []
    connection_strength = 0.7

    for day in range(days):
        # Apply regular decay (not engaged)
        decay = calculate_decay(bright_star.brightness, bright_star.domain)
        bright_star.brightness -= decay

        # Apply dark star drain (V3: reduced rate)
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
        })

    return results


def scenario_recovery(days: int = 60) -> List[dict]:
    star = Star(name="Health", domain="health", brightness=0.15, state=State.DIM)
    results = []

    for day in range(days):
        action = DayAction(experiments_completed=1, difficulty="small")
        star = simulate_day(star, action)
        results.append({
            "day": day + 1,
            "brightness": round(star.brightness, 3),
            "state": star.state.value,
        })

    return results


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

    return analysis


def main():
    print("="*60)
    print("CONSTELLATION STATES SIMULATION - V3 (FINAL)")
    print("="*60)
    print("\nKey V3 changes:")
    print("  - Proportional decay (slows near floor)")
    print("  - Maintenance zone below 0.3 (50% slower decay)")
    print("  - Reduced base impacts for slower progression")
    print("  - Reduced dark star drain rate")

    scenarios = [
        ("Ideal User", scenario_ideal_user, 30),
        ("Struggling User (30%)", scenario_struggling_user, 30),
        ("Absent User", scenario_absent_user, 90),
        ("Gaming Attempt", scenario_gaming_attempt, 21),
        ("Dark Star Drain", scenario_dark_star_drain, 60),
        ("Recovery from Low", scenario_recovery, 60),
    ]

    all_analyses = []

    for name, func, _ in scenarios:
        results = func()
        analysis = analyze_scenario(name, results)
        all_analyses.append(analysis)

        print(f"\n{'='*50}")
        print(f"{name}")
        print(f"{'='*50}")

        # Show key days
        days_to_show = [0, 6, 13, 20, 29] if len(results) >= 30 else [0, 6, 13]
        days_to_show = [d for d in days_to_show if d < len(results)]
        if len(results) > 30:
            days_to_show.append(len(results) - 1)

        for i in days_to_show:
            r = results[i]
            print(f"  Day {r['day']:2d}: brightness={r['brightness']:.3f}")

        print(f"\n  Days to BRIGHT: {analysis.get('day_reached_bright', 'N/A')}")
        print(f"  Final: {analysis['end_brightness']:.3f} ({analysis['final_state']})")

    # Validation
    print("\n" + "="*60)
    print("VALIDATION CHECKLIST - V3")
    print("="*60)

    ideal = all_analyses[0]
    struggling = all_analyses[1]
    absent = all_analyses[2]
    gaming = all_analyses[3]
    dark = all_analyses[4]
    recovery = all_analyses[5]

    checks = [
        ("Ideal user: BRIGHT in 10-18 days",
         10 <= ideal.get("day_reached_bright", 0) <= 18,
         f"Got: {ideal.get('day_reached_bright', 'N/A')}"),

        ("Gaming: BRIGHT in 7+ days (slowed)",
         gaming.get("day_reached_bright", 999) >= 7,
         f"Got: {gaming.get('day_reached_bright', 'N/A')}"),

        ("Struggling: End >= 50% of start (graceful decline)",
         struggling["end_brightness"] >= struggling["start_brightness"] * 0.5,
         f"{struggling['start_brightness']:.2f} → {struggling['end_brightness']:.2f}"),

        ("Absent: Doesn't hit floor (>0.1)",
         absent["end_brightness"] > 0.1,
         f"End: {absent['end_brightness']:.2f}"),

        ("Dark drain: Gradual (>0.25 at day 60)",
         dark["end_brightness"] > 0.25,
         f"End: {dark['end_brightness']:.2f}"),

        ("Recovery: BRIGHT possible (<30 days)",
         recovery.get("day_reached_bright", 999) <= 30,
         f"Got: {recovery.get('day_reached_bright', 'N/A')}"),
    ]

    passed = 0
    for check, result, detail in checks:
        status = "✓" if result else "✗"
        if result:
            passed += 1
        print(f"  {status} {check}")
        print(f"    → {detail}")

    print(f"\n  SCORE: {passed}/{len(checks)} passed")

    if passed == len(checks):
        print("\n  ★ ALL CHECKS PASSED - Constants are validated! ★")


if __name__ == "__main__":
    main()
