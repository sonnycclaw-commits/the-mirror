"""
Brightness & Decay Simulation

Validates the brightness-decay formulas against expected behavior.
Run: python simulation.py
"""

import math
from dataclasses import dataclass, field
from typing import List, Optional
from enum import Enum

# =============================================================================
# CONSTANTS (from 02-blood.md)
# =============================================================================

# Brightness bounds
MIN_BRIGHTNESS = 0.05
MAX_BRIGHTNESS = 1.0
SOFT_FLOOR_ZONE = 0.15
SOFT_FLOOR_FACTOR = 0.7

# Experiment impact
BASE_EXPERIMENT_IMPACT = 0.03
DIFFICULTY_MULTIPLIERS = {"tiny": 0.5, "small": 0.75, "medium": 1.0, "stretch": 1.5}
NOVELTY_BONUS = 1.2
MAX_DAILY_GAIN = 0.06

# Insight impact
INSIGHT_IMPACT = 0.02
DEPTH_MULTIPLIERS = {"surface": 0.5, "pattern": 1.0, "root": 1.5}
SOURCE_MULTIPLIERS = {"user_initiated": 1.2, "tars_prompted": 1.0, "tars_observed": 0.8}

# Streak
STREAK_GROWTH_RATE = 0.15
MAX_STREAK_BONUS = 1.3
STREAK_PRESERVATION_RATE = 0.5

# Spillover
SPILLOVER_RATE = 0.3
SPILLOVER_THRESHOLD = 0.8

# Recovery
RECOVERY_BASE = 0.05
RECOVERY_MIN_DAYS = 7
RECOVERY_SCALE = 0.3
RECOVERY_MAX_MULTIPLIER = 2.0

# Skip penalty
BASE_SKIP_PENALTY = 0.008
MAX_SKIP_MULTIPLIER = 2.0

# Contradiction
CONTRADICTION_PENALTY = 0.04

# Decay
HALF_LIVES = {
    "Health": 7,
    "Relationships": 14,
    "Wealth": 21,
    "Purpose": 30,
    "Soul": 90,
}
MAINTENANCE_ZONE = 0.3

# Neglect
NEGLECT_THRESHOLD_1 = 7
NEGLECT_THRESHOLD_2 = 21
NEGLECT_MULTIPLIER_1 = 1.5
NEGLECT_MULTIPLIER_2 = 2.0

# Dark star
DARK_DRAIN_RATE = 0.006


# =============================================================================
# DATA STRUCTURES
# =============================================================================

class StarState(Enum):
    NASCENT = "nascent"
    FLICKERING = "flickering"
    DIM = "dim"
    BRIGHT = "bright"
    DARK = "dark"
    DORMANT = "dormant"


@dataclass
class Experiment:
    difficulty: str = "small"
    alignment: float = 1.0
    is_novel: bool = False


@dataclass
class Insight:
    depth: str = "pattern"
    source: str = "tars_prompted"


@dataclass
class DayEvents:
    experiments: List[Experiment] = field(default_factory=list)
    insights: List[Insight] = field(default_factory=list)
    skips: int = 0
    contradictions: int = 0
    engaged: bool = False  # Did user engage at all?


@dataclass
class Star:
    brightness: float = 0.3
    domain: str = "Health"
    streak_days: int = 0
    consecutive_skips: int = 0
    days_since_engaged: int = 0
    is_dark: bool = False

    # For tracking
    state: StarState = StarState.FLICKERING
    returning: bool = False


@dataclass
class Snapshot:
    day: int
    brightness: float
    streak: int
    state: str
    gains: float
    losses: float
    net: float


# =============================================================================
# FORMULAS
# =============================================================================

def calculate_experiment_gain(experiments: List[Experiment]) -> float:
    total = 0
    for exp in experiments:
        base = BASE_EXPERIMENT_IMPACT
        difficulty = DIFFICULTY_MULTIPLIERS.get(exp.difficulty, 1.0)
        alignment = exp.alignment
        novelty = NOVELTY_BONUS if exp.is_novel else 1.0
        total += base * difficulty * alignment * novelty
    return total


def calculate_insight_gain(insights: List[Insight]) -> float:
    total = 0
    for insight in insights:
        base = INSIGHT_IMPACT
        depth = DEPTH_MULTIPLIERS.get(insight.depth, 1.0)
        source = SOURCE_MULTIPLIERS.get(insight.source, 1.0)
        total += base * depth * source
    return total


def calculate_streak_bonus(streak_days: int) -> float:
    if streak_days <= 1:
        return 1.0
    bonus = 1 + STREAK_GROWTH_RATE * math.log(streak_days)
    return min(bonus, MAX_STREAK_BONUS)


def calculate_recovery_bonus(days_absent: int) -> float:
    if days_absent < RECOVERY_MIN_DAYS:
        return 0
    bonus = RECOVERY_BASE * min(
        1 + RECOVERY_SCALE * math.log(days_absent / RECOVERY_MIN_DAYS),
        RECOVERY_MAX_MULTIPLIER
    )
    return bonus


def calculate_skip_penalty(consecutive_skips: int) -> float:
    if consecutive_skips == 0:
        return 0
    elif consecutive_skips == 1:
        return 0  # First skip free
    elif consecutive_skips == 2:
        return BASE_SKIP_PENALTY
    elif consecutive_skips == 3:
        return BASE_SKIP_PENALTY * 1.5
    else:
        return BASE_SKIP_PENALTY * MAX_SKIP_MULTIPLIER


def calculate_decay(star: Star, engaged: bool) -> float:
    if engaged:
        return 0

    half_life = HALF_LIVES.get(star.domain, 14)
    base_rate = 1 - (0.5 ** (1 / half_life))

    distance_from_floor = (star.brightness - MIN_BRIGHTNESS) / (MAX_BRIGHTNESS - MIN_BRIGHTNESS)
    zone_factor = 0.5 if star.brightness < MAINTENANCE_ZONE else 1.0

    return star.brightness * base_rate * distance_from_floor * zone_factor


def calculate_neglect_acceleration(days_since_engaged: int) -> float:
    if days_since_engaged < NEGLECT_THRESHOLD_1:
        return 1.0
    elif days_since_engaged < NEGLECT_THRESHOLD_2:
        return NEGLECT_MULTIPLIER_1
    else:
        return NEGLECT_MULTIPLIER_2


def apply_soft_floor(new_brightness: float, old_brightness: float) -> float:
    if new_brightness < SOFT_FLOOR_ZONE:
        distance_to_floor = new_brightness - MIN_BRIGHTNESS
        new_brightness = MIN_BRIGHTNESS + (distance_to_floor * SOFT_FLOOR_FACTOR)
    return new_brightness


def clamp(value: float, min_val: float, max_val: float) -> float:
    return max(min_val, min(max_val, value))


def update_brightness(star: Star, events: DayEvents) -> tuple[float, float, float]:
    """Returns (gains, losses, new_brightness)"""

    # Calculate gains
    experiment_gain = calculate_experiment_gain(events.experiments)
    insight_gain = calculate_insight_gain(events.insights)
    recovery = calculate_recovery_bonus(star.days_since_engaged) if star.returning else 0

    total_gains = experiment_gain + insight_gain + recovery
    streak_bonus = calculate_streak_bonus(star.streak_days)
    total_gains *= streak_bonus
    total_gains = min(total_gains, MAX_DAILY_GAIN)

    # Calculate losses
    skip_penalty = calculate_skip_penalty(star.consecutive_skips + events.skips)
    contradiction_penalty = events.contradictions * CONTRADICTION_PENALTY
    decay = calculate_decay(star, events.engaged)
    neglect_mult = calculate_neglect_acceleration(star.days_since_engaged)

    total_losses = (skip_penalty + contradiction_penalty + decay) * neglect_mult

    # Apply
    new_brightness = star.brightness + total_gains - total_losses
    new_brightness = apply_soft_floor(new_brightness, star.brightness)
    new_brightness = clamp(new_brightness, MIN_BRIGHTNESS, MAX_BRIGHTNESS)

    return total_gains, total_losses, new_brightness


def update_star(star: Star, events: DayEvents) -> Star:
    """Update star state for one day."""
    gains, losses, new_brightness = update_brightness(star, events)

    # Update streak
    if events.engaged:
        star.streak_days += 1
        star.days_since_engaged = 0
        star.consecutive_skips = 0
        star.returning = False
    else:
        star.streak_days = max(0, int(star.streak_days * STREAK_PRESERVATION_RATE))
        star.days_since_engaged += 1
        star.consecutive_skips += events.skips

    star.brightness = new_brightness

    # Determine state (simplified)
    if star.brightness >= 0.7:
        star.state = StarState.BRIGHT
    elif star.brightness < 0.5:
        star.state = StarState.DIM
    else:
        star.state = StarState.FLICKERING

    if star.brightness <= MIN_BRIGHTNESS + 0.01:
        star.state = StarState.DORMANT

    return star


# =============================================================================
# SCENARIOS
# =============================================================================

def scenario_ideal_user(days: int = 30) -> List[Snapshot]:
    """User completes medium experiment every day."""
    star = Star(brightness=0.3, domain="Health")
    snapshots = []

    for day in range(1, days + 1):
        events = DayEvents(
            experiments=[Experiment(difficulty="medium", alignment=1.0)],
            engaged=True
        )
        gains, losses, _ = update_brightness(star, events)
        star = update_star(star, events)

        snapshots.append(Snapshot(
            day=day,
            brightness=round(star.brightness, 3),
            streak=star.streak_days,
            state=star.state.value,
            gains=round(gains, 4),
            losses=round(losses, 4),
            net=round(gains - losses, 4)
        ))

    return snapshots


def scenario_struggling_user(days: int = 30) -> List[Snapshot]:
    """User completes ~30% of experiments, skips randomly."""
    import random
    random.seed(42)  # Reproducible

    star = Star(brightness=0.3, domain="Health")
    snapshots = []

    for day in range(1, days + 1):
        engaged = random.random() < 0.3  # 30% completion rate

        if engaged:
            events = DayEvents(
                experiments=[Experiment(difficulty="tiny", alignment=1.0)],
                engaged=True
            )
        else:
            events = DayEvents(skips=1, engaged=False)

        gains, losses, _ = update_brightness(star, events)
        star = update_star(star, events)

        snapshots.append(Snapshot(
            day=day,
            brightness=round(star.brightness, 3),
            streak=star.streak_days,
            state=star.state.value,
            gains=round(gains, 4),
            losses=round(losses, 4),
            net=round(gains - losses, 4)
        ))

    return snapshots


def scenario_absent_user(engage_days: int = 14, absent_days: int = 60) -> List[Snapshot]:
    """User engages for 2 weeks, disappears, then returns."""
    star = Star(brightness=0.3, domain="Health")
    snapshots = []
    total_days = engage_days + absent_days + 14  # +14 for recovery period

    for day in range(1, total_days + 1):
        if day <= engage_days:
            # Active phase
            events = DayEvents(
                experiments=[Experiment(difficulty="medium", alignment=1.0)],
                engaged=True
            )
        elif day <= engage_days + absent_days:
            # Absent phase
            events = DayEvents(engaged=False)
        else:
            # Recovery phase
            if day == engage_days + absent_days + 1:
                star.returning = True
            events = DayEvents(
                experiments=[Experiment(difficulty="small", alignment=1.0)],
                engaged=True
            )

        gains, losses, _ = update_brightness(star, events)
        star = update_star(star, events)

        snapshots.append(Snapshot(
            day=day,
            brightness=round(star.brightness, 3),
            streak=star.streak_days,
            state=star.state.value,
            gains=round(gains, 4),
            losses=round(losses, 4),
            net=round(gains - losses, 4)
        ))

    return snapshots


def scenario_gaming_attempt() -> List[Snapshot]:
    """User tries to do 20 experiments in one day."""
    star = Star(brightness=0.3, domain="Health")

    # Day 1: 20 experiments
    experiments = [Experiment(difficulty="tiny", alignment=1.0) for _ in range(20)]
    events = DayEvents(experiments=experiments, engaged=True)
    gains, losses, _ = update_brightness(star, events)
    star = update_star(star, events)

    return [Snapshot(
        day=1,
        brightness=round(star.brightness, 3),
        streak=star.streak_days,
        state=star.state.value,
        gains=round(gains, 4),
        losses=round(losses, 4),
        net=round(gains - losses, 4)
    )]


def scenario_dark_star_drain(days: int = 60) -> List[Snapshot]:
    """Star connected to dark star, no engagement."""
    star = Star(brightness=0.6, domain="Relationships")
    snapshots = []

    # Simulate dark star drain (manual addition to losses)
    for day in range(1, days + 1):
        events = DayEvents(engaged=False)
        gains, losses, _ = update_brightness(star, events)

        # Add dark star drain (assuming connection strength 0.8, dark intensity 0.7)
        dark_drain = DARK_DRAIN_RATE * 0.8 * 0.7

        star.days_since_engaged += 1
        star.brightness = max(MIN_BRIGHTNESS, star.brightness - losses - dark_drain)

        snapshots.append(Snapshot(
            day=day,
            brightness=round(star.brightness, 3),
            streak=0,
            state="dim" if star.brightness >= 0.05 else "dormant",
            gains=0,
            losses=round(losses + dark_drain, 4),
            net=round(-losses - dark_drain, 4)
        ))

    return snapshots


def scenario_recovery_from_dim(days: int = 30) -> List[Snapshot]:
    """Star starts at DIM (0.25), user engages daily."""
    star = Star(brightness=0.25, domain="Purpose")
    star.days_since_engaged = 14  # Was absent
    star.returning = True
    snapshots = []

    for day in range(1, days + 1):
        events = DayEvents(
            experiments=[Experiment(difficulty="medium", alignment=1.0)],
            engaged=True
        )
        gains, losses, _ = update_brightness(star, events)
        star = update_star(star, events)

        snapshots.append(Snapshot(
            day=day,
            brightness=round(star.brightness, 3),
            streak=star.streak_days,
            state=star.state.value,
            gains=round(gains, 4),
            losses=round(losses, 4),
            net=round(gains - losses, 4)
        ))

    return snapshots


# =============================================================================
# MAIN
# =============================================================================

def print_scenario(name: str, snapshots: List[Snapshot], milestones: List[int] = None):
    print(f"\n{'='*60}")
    print(f"SCENARIO: {name}")
    print(f"{'='*60}")

    if milestones is None:
        milestones = [1, 7, 14, 21, 30]

    print(f"{'Day':>4} | {'Brightness':>10} | {'Streak':>6} | {'State':>10} | {'Net':>8}")
    print("-" * 50)

    for snap in snapshots:
        if snap.day in milestones or snap.day == len(snapshots):
            print(f"{snap.day:>4} | {snap.brightness:>10.3f} | {snap.streak:>6} | {snap.state:>10} | {snap.net:>+8.4f}")

    final = snapshots[-1]
    print(f"\nFinal: brightness={final.brightness:.3f}, state={final.state}")


def main():
    print("\n" + "="*60)
    print("BRIGHTNESS & DECAY SIMULATION")
    print("="*60)

    # Scenario 1: Ideal User
    results = scenario_ideal_user(30)
    print_scenario("Ideal User (daily medium experiment)", results)
    bright_day = next((s.day for s in results if s.brightness >= 0.7), None)
    print(f"→ Days to BRIGHT: {bright_day}")

    # Scenario 2: Struggling User
    results = scenario_struggling_user(30)
    print_scenario("Struggling User (30% completion)", results)

    # Scenario 3: Absent User
    results = scenario_absent_user(14, 60)
    print_scenario("Absent User (14d engage → 60d absent → return)", results,
                   [1, 7, 14, 30, 60, 74, 88])
    min_brightness = min(s.brightness for s in results)
    print(f"→ Minimum brightness during absence: {min_brightness:.3f}")

    # Scenario 4: Gaming Attempt
    results = scenario_gaming_attempt()
    print_scenario("Gaming Attempt (20 experiments day 1)", results, [1])
    print(f"→ Capped at MAX_DAILY_GAIN: {MAX_DAILY_GAIN}")

    # Scenario 5: Dark Star Drain
    results = scenario_dark_star_drain(60)
    print_scenario("Dark Star Drain (60 days, no engagement)", results, [1, 14, 30, 45, 60])

    # Scenario 6: Recovery from DIM
    results = scenario_recovery_from_dim(30)
    print_scenario("Recovery from DIM (0.25 start)", results)
    bright_day = next((s.day for s in results if s.brightness >= 0.7), None)
    print(f"→ Days to BRIGHT from DIM: {bright_day}")

    print("\n" + "="*60)
    print("SIMULATION COMPLETE")
    print("="*60)


if __name__ == "__main__":
    main()
