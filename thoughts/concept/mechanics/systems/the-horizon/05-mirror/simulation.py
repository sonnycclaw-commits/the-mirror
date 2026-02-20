"""
The Horizon - Multi-Walk Simulation

Validates Horizon mechanics: slingshot, drift, momentum accumulation.
Run: python simulation.py
"""

import math
from dataclasses import dataclass, field
from typing import List, Optional
from enum import Enum

# =============================================================================
# CONSTANTS (from 02-blood.md)
# =============================================================================

# Slingshot power by timeframe
SLINGSHOT_POWER = {
    "3_month": 0.15,
    "6_month": 0.25,
    "1_year": 0.40,
    "3_year": 0.60,
    "5_year": 0.80,
    "10_year": 1.00,
}

# Slingshot
MOMENTUM_AMPLIFIER = 0.20
MAX_ACCUMULATED_VELOCITY = 2.0

# Drift
DRIFT_THRESHOLD = 0.10
DRIFT_DAYS = 30
DARK_GRAVITY = 0.05
MAX_DRIFT_PULL = 0.30
DARK_DISTANCE = 2.0

# Horizon momentum
HORIZON_MOMENTUM_DECAY = 0.02
MILESTONE_MOMENTUM_BASE = 0.20

# Arrival
POST_ARRIVAL_PRESERVATION = 0.50

# Walk (from the-walk)
BASE_DECAY = 0.02
EXPERIMENT_THRUST = {
    "tiny": 0.01,
    "small": 0.02,
    "medium": 0.03,
    "stretch": 0.05,
}


# =============================================================================
# DATA STRUCTURES
# =============================================================================

class HorizonState(Enum):
    UNDEFINED = "undefined"
    EXCAVATING = "excavating"
    MAPPED = "mapped"
    ACTIVE = "active"
    REVIEWING = "reviewing"
    REMAPPING = "remapping"
    DRIFTING = "drifting"
    ARRIVED = "arrived"


@dataclass
class Walk:
    velocity: float = 0.1
    momentum: float = 0.0
    days_active: int = 0
    days_inactive: int = 0
    milestones_reached: int = 0
    target_milestones: int = 5


@dataclass
class Horizon:
    state: HorizonState = HorizonState.ACTIVE
    slingshot_velocity: float = 0.0
    momentum: float = 0.0
    walks: List[Walk] = field(default_factory=list)
    distance_to_dark: float = DARK_DISTANCE
    days_drifting: int = 0
    total_milestones: int = 0
    years_active: float = 0.0


@dataclass
class Snapshot:
    day: int
    horizon_state: str
    slingshot_velocity: float
    horizon_momentum: float
    distance_to_dark: float
    avg_walk_velocity: float
    total_milestones: int


# =============================================================================
# FORMULAS
# =============================================================================

def calculate_slingshot(walk_velocity: float, milestone_timeframe: str,
                        horizon: Horizon, next_alignment: float = 1.0) -> float:
    """Calculate slingshot boost from completing a milestone."""
    power = SLINGSHOT_POWER.get(milestone_timeframe, 0.25)
    alignment = max(0, next_alignment)
    momentum_bonus = 1 + (horizon.slingshot_velocity * MOMENTUM_AMPLIFIER)

    multiplier = power * alignment * momentum_bonus
    return multiplier


def update_walk_daily(walk: Walk, engaged: bool = True) -> Walk:
    """Simplified Walk update for simulation."""
    if engaged:
        thrust = EXPERIMENT_THRUST["medium"]
        walk.velocity = min(1.0, walk.velocity + thrust)
        walk.days_active += 1
        walk.days_inactive = 0
    else:
        decay = walk.velocity * BASE_DECAY
        walk.velocity = max(0, walk.velocity - decay)
        walk.days_inactive += 1

    return walk


def update_horizon_daily(horizon: Horizon, walk_activities: List[bool]) -> Horizon:
    """Update Horizon for one day."""
    # Update all Walks
    for i, walk in enumerate(horizon.walks):
        engaged = walk_activities[i] if i < len(walk_activities) else False
        update_walk_daily(walk, engaged)

    # Calculate average velocity
    if horizon.walks:
        avg_velocity = sum(w.velocity for w in horizon.walks) / len(horizon.walks)
    else:
        avg_velocity = 0

    # Update Horizon momentum
    horizon.momentum = horizon.momentum * (1 - HORIZON_MOMENTUM_DECAY) + avg_velocity * 0.05

    # Decay slingshot velocity (slower)
    horizon.slingshot_velocity *= (1 - HORIZON_MOMENTUM_DECAY / 2)

    # Check drift
    if avg_velocity < DRIFT_THRESHOLD:
        horizon.days_drifting += 1
        if horizon.days_drifting >= DRIFT_DAYS:
            horizon.state = HorizonState.DRIFTING

            # Calculate drift pull
            if horizon.distance_to_dark > 0.1:
                pull = min(DARK_GRAVITY / horizon.distance_to_dark**2, MAX_DRIFT_PULL)
                drift_amount = pull * (1 - avg_velocity)
                horizon.distance_to_dark = max(0.1, horizon.distance_to_dark - drift_amount)
    else:
        horizon.days_drifting = 0
        if horizon.state == HorizonState.DRIFTING:
            horizon.state = HorizonState.ACTIVE

    horizon.years_active += 1/365

    return horizon


def complete_milestone(horizon: Horizon, walk_index: int,
                       timeframe: str, next_alignment: float = 1.0) -> float:
    """Complete a milestone and calculate slingshot."""
    walk = horizon.walks[walk_index]

    # Calculate slingshot
    multiplier = calculate_slingshot(walk.velocity, timeframe, horizon, next_alignment)

    # Apply slingshot to exit velocity
    slingshot_boost = walk.velocity * multiplier
    walk.velocity = min(1.0, walk.velocity * (1 + multiplier))

    # Accumulate to Horizon
    horizon.slingshot_velocity = min(
        horizon.slingshot_velocity + slingshot_boost,
        MAX_ACCUMULATED_VELOCITY
    )

    # Momentum boost
    timeframe_mult = {"3_month": 0.5, "6_month": 0.75, "1_year": 1.0,
                      "3_year": 1.5, "5_year": 2.0, "10_year": 3.0}
    horizon.momentum += MILESTONE_MOMENTUM_BASE * timeframe_mult.get(timeframe, 1.0)

    walk.milestones_reached += 1
    horizon.total_milestones += 1

    return slingshot_boost


# =============================================================================
# SCENARIOS
# =============================================================================

def scenario_ideal_horizon(years: int = 5) -> List[Snapshot]:
    """User completes 1-year milestones, compounding slingshots."""
    horizon = Horizon()
    horizon.walks = [Walk()]
    snapshots = []

    total_days = years * 365

    for day in range(1, total_days + 1):
        # Daily engagement
        update_horizon_daily(horizon, [True])

        # Milestone every ~6 months (180 days)
        if day % 180 == 0:
            complete_milestone(horizon, 0, "6_month", next_alignment=1.0)

        # 1-year milestone at year marks
        if day % 365 == 0:
            complete_milestone(horizon, 0, "1_year", next_alignment=1.0)

        # Snapshot monthly
        if day % 30 == 0:
            avg_v = sum(w.velocity for w in horizon.walks) / max(1, len(horizon.walks))
            snapshots.append(Snapshot(
                day=day,
                horizon_state=horizon.state.value,
                slingshot_velocity=round(horizon.slingshot_velocity, 3),
                horizon_momentum=round(horizon.momentum, 3),
                distance_to_dark=round(horizon.distance_to_dark, 2),
                avg_walk_velocity=round(avg_v, 3),
                total_milestones=horizon.total_milestones
            ))

    return snapshots


def scenario_drift_and_recovery(days: int = 180) -> List[Snapshot]:
    """User goes active, then drifts, then recovers."""
    horizon = Horizon()
    horizon.walks = [Walk()]
    snapshots = []

    for day in range(1, days + 1):
        if day <= 60:
            # Active phase
            engaged = True
        elif day <= 120:
            # Drift phase
            engaged = False
        else:
            # Recovery phase
            engaged = True

        update_horizon_daily(horizon, [engaged])

        # Snapshot weekly
        if day % 7 == 0:
            avg_v = sum(w.velocity for w in horizon.walks) / max(1, len(horizon.walks))
            snapshots.append(Snapshot(
                day=day,
                horizon_state=horizon.state.value,
                slingshot_velocity=round(horizon.slingshot_velocity, 3),
                horizon_momentum=round(horizon.momentum, 3),
                distance_to_dark=round(horizon.distance_to_dark, 3),
                avg_walk_velocity=round(avg_v, 3),
                total_milestones=horizon.total_milestones
            ))

    return snapshots


def scenario_slingshot_cascade(milestones: int = 5) -> List[Snapshot]:
    """Shows how slingshots compound across milestone completions."""
    horizon = Horizon()
    horizon.walks = [Walk(velocity=0.3)]  # Start with some velocity
    snapshots = []

    milestone_days = [60, 120, 180, 300, 365]  # Increasing intervals
    timeframes = ["3_month", "6_month", "6_month", "1_year", "1_year"]

    for day in range(1, 400):
        update_horizon_daily(horizon, [True])

        # Check milestone
        if day in milestone_days:
            idx = milestone_days.index(day)
            boost = complete_milestone(horizon, 0, timeframes[idx], next_alignment=1.0)
            print(f"Day {day}: Milestone ({timeframes[idx]}) - slingshot boost +{boost:.3f}")

        # Snapshot at milestones and key days
        if day in milestone_days or day == 1:
            avg_v = sum(w.velocity for w in horizon.walks) / max(1, len(horizon.walks))
            snapshots.append(Snapshot(
                day=day,
                horizon_state=horizon.state.value,
                slingshot_velocity=round(horizon.slingshot_velocity, 3),
                horizon_momentum=round(horizon.momentum, 3),
                distance_to_dark=round(horizon.distance_to_dark, 2),
                avg_walk_velocity=round(avg_v, 3),
                total_milestones=horizon.total_milestones
            ))

    return snapshots


def scenario_multi_walk_horizon(days: int = 365) -> dict:
    """User runs 2 Walks, each toward different milestones."""
    horizon = Horizon()
    horizon.walks = [Walk(), Walk()]  # Career + Health

    results = {"career": [], "health": [], "horizon": []}

    for day in range(1, days + 1):
        # Career gets 60% days, Health gets 40%
        career_engaged = (day % 5) != 0  # 80%
        health_engaged = (day % 3) != 0  # 66%

        update_horizon_daily(horizon, [career_engaged, health_engaged])

        # Milestones at different rates
        if day == 120:  # Career 4-month
            complete_milestone(horizon, 0, "3_month")
        if day == 180:  # Health 6-month
            complete_milestone(horizon, 1, "6_month")
        if day == 300:  # Career 10-month
            complete_milestone(horizon, 0, "1_year")

        # Monthly snapshot
        if day % 30 == 0:
            results["career"].append(round(horizon.walks[0].velocity, 3))
            results["health"].append(round(horizon.walks[1].velocity, 3))
            results["horizon"].append(round(horizon.slingshot_velocity, 3))

    return results


# =============================================================================
# MAIN
# =============================================================================

def print_scenario(name: str, snapshots: List[Snapshot]):
    print(f"\n{'='*70}")
    print(f"SCENARIO: {name}")
    print(f"{'='*70}")

    print(f"{'Day':>5} | {'State':>10} | {'Slingshot':>9} | {'H.Mom':>6} | {'Dark':>6} | {'Velocity':>8} | {'Miles':>5}")
    print("-" * 70)

    for snap in snapshots:
        print(f"{snap.day:>5} | {snap.horizon_state:>10} | {snap.slingshot_velocity:>9.3f} | "
              f"{snap.horizon_momentum:>6.3f} | {snap.distance_to_dark:>6.2f} | "
              f"{snap.avg_walk_velocity:>8.3f} | {snap.total_milestones:>5}")


def main():
    print("\n" + "="*70)
    print("THE HORIZON - MULTI-WALK SIMULATION")
    print("="*70)

    # Scenario 1: Ideal Horizon (5 years)
    results = scenario_ideal_horizon(5)
    print_scenario("Ideal Horizon (5 years, monthly snapshots)", results)
    print(f"→ Final slingshot velocity: {results[-1].slingshot_velocity:.3f}")
    print(f"→ Total milestones: {results[-1].total_milestones}")

    # Scenario 2: Drift and Recovery
    results = scenario_drift_and_recovery(180)
    print_scenario("Drift and Recovery (60d active → 60d drift → 60d recovery)", results)
    drift_start = next((s.day for s in results if s.horizon_state == "drifting"), None)
    min_distance = min(s.distance_to_dark for s in results)
    print(f"→ Drift started at day: {drift_start}")
    print(f"→ Minimum distance to dark star: {min_distance:.3f}")

    # Scenario 3: Slingshot Cascade
    print("\n" + "="*70)
    print("SCENARIO: Slingshot Cascade")
    print("="*70)
    results = scenario_slingshot_cascade()
    print(f"\nSnapshots:")
    print_scenario("Slingshot Cascade (5 milestones)", results)

    # Scenario 4: Multi-Walk
    results = scenario_multi_walk_horizon(365)
    print("\n" + "="*70)
    print("SCENARIO: Multi-Walk Horizon (Career + Health)")
    print("="*70)
    print("\nMonthly velocities:")
    print(f"  Career:  {results['career']}")
    print(f"  Health:  {results['health']}")
    print(f"  Horizon: {results['horizon']}")
    print(f"→ Career final velocity: {results['career'][-1]:.3f}")
    print(f"→ Health final velocity: {results['health'][-1]:.3f}")
    print(f"→ Horizon slingshot: {results['horizon'][-1]:.3f}")

    print("\n" + "="*70)
    print("SIMULATION COMPLETE")
    print("="*70)


if __name__ == "__main__":
    main()
