"""
The Walk - Journey Simulation

Validates journey mechanics: velocity, momentum, thrust, milestone progression.
Run: python simulation.py
"""

import math
from dataclasses import dataclass, field
from typing import List, Optional
from enum import Enum

# =============================================================================
# CONSTANTS (from 02-blood.md)
# =============================================================================

# Velocity bounds
MIN_VELOCITY = 0.0
MAX_VELOCITY = 1.0

# Momentum
MOMENTUM_DECAY = 0.05  # per day
MOMENTUM_BOOST_FACTOR = 0.30

# Thrust
BASE_THRUST = 0.10
MILESTONE_ACCEL_BONUS = 0.05

DIFFICULTY_MULTIPLIERS = {
    "1_month": 0.8,
    "3_month": 1.0,
    "6_month": 1.2,
    "1_year": 1.5,
    "2_year": 2.0,
    "5_year": 3.0,
}

EXPERIMENT_THRUST = {
    "tiny": 0.01,
    "small": 0.02,
    "medium": 0.03,
    "stretch": 0.05,
}

# Decay
BASE_DECAY = 0.02  # per day
DECAY_ACCELERATION = 0.01  # per inactive day

# Stall
STALL_THRESHOLD = 0.05
STALL_DAYS = 14

# Milestones
REACH_THRESHOLD = 0.15

# Multi-journey
MAX_DAILY_EXPERIMENTS = 3
MAX_ACTIVE_JOURNEYS = 3


# =============================================================================
# DATA STRUCTURES
# =============================================================================

class JourneyState(Enum):
    DISCOVERY = "discovery"
    PLOTTED = "plotted"
    PREVIEWING = "previewing"
    WAITING = "waiting"
    WALKING = "walking"
    MILESTONE = "milestone"
    PAUSED = "paused"
    COMPLETE = "complete"


@dataclass
class Experiment:
    difficulty: str = "small"
    completed: bool = True
    relevance: float = 1.0  # How aligned with journey direction


@dataclass
class Milestone:
    id: str
    timeframe: str  # 1_month, 3_month, etc.
    distance_start: float = 1.0  # Distance when journey started
    reached: bool = False


@dataclass
class DayEvents:
    experiments: List[Experiment] = field(default_factory=list)
    reached_milestone: bool = False
    milestone: Optional[Milestone] = None
    engaged: bool = True


@dataclass
class Journey:
    velocity: float = 0.05  # Starting velocity
    momentum: float = 0.0
    acceleration: float = 0.0

    # Position/distance
    distance_to_next: float = 1.0  # Normalized 0-1

    # Tracking
    days_active: int = 0
    days_inactive: int = 0
    milestones_reached: int = 0
    total_milestones: int = 5  # Typical journey

    state: JourneyState = JourneyState.WALKING
    is_stalled: bool = False


@dataclass
class Snapshot:
    day: int
    velocity: float
    momentum: float
    distance: float
    milestones: int
    state: str
    gains: float
    decay: float


# =============================================================================
# FORMULAS
# =============================================================================

def calculate_experiment_thrust(experiments: List[Experiment]) -> float:
    """Calculate total acceleration from experiments."""
    total = 0
    for exp in experiments:
        if exp.completed:
            base = EXPERIMENT_THRUST.get(exp.difficulty, 0.02)
            total += base * exp.relevance
    return total


def calculate_momentum_boost(momentum: float) -> float:
    """Momentum makes velocity gains easier."""
    return 1 + (momentum * MOMENTUM_BOOST_FACTOR)


def calculate_decay(velocity: float, days_inactive: int) -> float:
    """Velocity decay when inactive."""
    if days_inactive == 0:
        return 0

    rate = BASE_DECAY + (DECAY_ACCELERATION * days_inactive)
    return velocity * rate


def calculate_milestone_thrust(milestone: Milestone, milestone_index: int) -> float:
    """Thrust boost from reaching milestone."""
    diff_mult = DIFFICULTY_MULTIPLIERS.get(milestone.timeframe, 1.0)
    index_bonus = 1 + (milestone_index * 0.1)  # Later milestones worth more
    return BASE_THRUST * diff_mult * index_bonus


def clamp(value: float, min_val: float, max_val: float) -> float:
    return max(min_val, min(max_val, value))


def update_journey(journey: Journey, events: DayEvents) -> tuple[float, float]:
    """Update journey for one day. Returns (gains, decay)."""

    # Calculate experiment thrust
    exp_thrust = calculate_experiment_thrust(events.experiments)

    # Momentum boost
    momentum_mult = calculate_momentum_boost(journey.momentum)

    # Total acceleration from experiments
    acceleration = exp_thrust * momentum_mult

    # Milestone bonus
    if events.reached_milestone and events.milestone:
        thrust = calculate_milestone_thrust(events.milestone, journey.milestones_reached)
        acceleration += thrust
        journey.milestones_reached += 1

    # Calculate decay
    if events.engaged:
        decay = 0
        journey.days_inactive = 0
        journey.days_active += 1
    else:
        journey.days_inactive += 1
        decay = calculate_decay(journey.velocity, journey.days_inactive)

    # Update velocity
    velocity_delta = acceleration - decay
    journey.velocity = clamp(
        journey.velocity + velocity_delta,
        MIN_VELOCITY,
        MAX_VELOCITY
    )

    # Update momentum
    if velocity_delta > 0:
        journey.momentum += velocity_delta
    journey.momentum = max(0, journey.momentum * (1 - MOMENTUM_DECAY))

    # Update distance (move toward milestone)
    journey.distance_to_next = max(0, journey.distance_to_next - journey.velocity * 0.1)

    # Check stall
    journey.is_stalled = (
        journey.velocity < STALL_THRESHOLD and
        journey.days_inactive >= STALL_DAYS
    )

    # Check complete
    if journey.milestones_reached >= journey.total_milestones:
        journey.state = JourneyState.COMPLETE

    return acceleration, decay


# =============================================================================
# SCENARIOS
# =============================================================================

def scenario_ideal_journey(days: int = 90) -> List[Snapshot]:
    """User completes medium experiment daily, reaches milestones on schedule."""
    journey = Journey()
    snapshots = []

    # Milestone schedule: days 15, 30, 45, 60, 75 (every 15 days)
    milestone_days = [15, 30, 45, 60, 75]

    for day in range(1, days + 1):
        reached = day in milestone_days
        milestone = Milestone(
            id=f"star-{len([d for d in milestone_days if d <= day])}",
            timeframe="3_month"
        ) if reached else None

        events = DayEvents(
            experiments=[Experiment(difficulty="medium", completed=True, relevance=1.0)],
            reached_milestone=reached,
            milestone=milestone,
            engaged=True
        )

        gains, decay = update_journey(journey, events)

        snapshots.append(Snapshot(
            day=day,
            velocity=round(journey.velocity, 3),
            momentum=round(journey.momentum, 3),
            distance=round(journey.distance_to_next, 3),
            milestones=journey.milestones_reached,
            state=journey.state.value,
            gains=round(gains, 4),
            decay=round(decay, 4)
        ))

        # Reset distance for next milestone
        if reached:
            journey.distance_to_next = 1.0

    return snapshots


def scenario_struggling_journey(days: int = 90) -> List[Snapshot]:
    """User completes ~40% of experiments, slower milestone pace."""
    import random
    random.seed(42)

    journey = Journey()
    snapshots = []

    # Slower milestones: every 25 days
    milestone_days = [25, 50, 75]

    for day in range(1, days + 1):
        engaged = random.random() < 0.4  # 40% completion
        reached = day in milestone_days and engaged

        if engaged:
            events = DayEvents(
                experiments=[Experiment(difficulty="tiny", completed=True, relevance=0.8)],
                reached_milestone=reached,
                milestone=Milestone(id=f"star-{len([d for d in milestone_days if d <= day])}",
                                   timeframe="6_month") if reached else None,
                engaged=True
            )
        else:
            events = DayEvents(engaged=False)

        gains, decay = update_journey(journey, events)

        snapshots.append(Snapshot(
            day=day,
            velocity=round(journey.velocity, 3),
            momentum=round(journey.momentum, 3),
            distance=round(journey.distance_to_next, 3),
            milestones=journey.milestones_reached,
            state=journey.state.value,
            gains=round(gains, 4),
            decay=round(decay, 4)
        ))

        if reached:
            journey.distance_to_next = 1.0

    return snapshots


def scenario_momentum_acceleration(days: int = 60) -> List[Snapshot]:
    """Shows how momentum accelerates progress over time."""
    journey = Journey()
    snapshots = []

    # Reach milestone at day 20 and day 40
    milestone_days = [20, 40]

    for day in range(1, days + 1):
        reached = day in milestone_days

        events = DayEvents(
            experiments=[Experiment(difficulty="small", completed=True, relevance=1.0)],
            reached_milestone=reached,
            milestone=Milestone(id=f"star-{len([d for d in milestone_days if d <= day])}",
                               timeframe="3_month") if reached else None,
            engaged=True
        )

        gains, decay = update_journey(journey, events)

        snapshots.append(Snapshot(
            day=day,
            velocity=round(journey.velocity, 3),
            momentum=round(journey.momentum, 3),
            distance=round(journey.distance_to_next, 3),
            milestones=journey.milestones_reached,
            state=journey.state.value,
            gains=round(gains, 4),
            decay=round(decay, 4)
        ))

        if reached:
            journey.distance_to_next = 1.0

    return snapshots


def scenario_stall_recovery(days: int = 45) -> List[Snapshot]:
    """User stalls mid-journey then recovers."""
    journey = Journey()
    journey.velocity = 0.15  # Had some momentum
    journey.momentum = 0.1
    snapshots = []

    for day in range(1, days + 1):
        if day <= 10:
            # Active phase
            events = DayEvents(
                experiments=[Experiment(difficulty="medium", completed=True)],
                engaged=True
            )
        elif day <= 30:
            # Stall phase - no engagement
            events = DayEvents(engaged=False)
        else:
            # Recovery phase
            events = DayEvents(
                experiments=[Experiment(difficulty="small", completed=True)],
                engaged=True
            )

        gains, decay = update_journey(journey, events)

        snapshots.append(Snapshot(
            day=day,
            velocity=round(journey.velocity, 3),
            momentum=round(journey.momentum, 3),
            distance=round(journey.distance_to_next, 3),
            milestones=journey.milestones_reached,
            state=journey.state.value + (" [STALL]" if journey.is_stalled else ""),
            gains=round(gains, 4),
            decay=round(decay, 4)
        ))

    return snapshots


def scenario_milestone_thrust_cascade(days: int = 30) -> List[Snapshot]:
    """Shows thrust multiplication from consecutive milestones."""
    journey = Journey()
    snapshots = []

    # Rapid milestones: day 5, 10, 15, 20, 25
    milestone_days = [5, 10, 15, 20, 25]

    for day in range(1, days + 1):
        reached = day in milestone_days

        events = DayEvents(
            experiments=[Experiment(difficulty="stretch", completed=True, relevance=1.0)],
            reached_milestone=reached,
            milestone=Milestone(
                id=f"star-{milestone_days.index(day)+1}" if reached else "",
                timeframe="1_month"
            ) if reached else None,
            engaged=True
        )

        gains, decay = update_journey(journey, events)

        snapshots.append(Snapshot(
            day=day,
            velocity=round(journey.velocity, 3),
            momentum=round(journey.momentum, 3),
            distance=round(journey.distance_to_next, 3),
            milestones=journey.milestones_reached,
            state=journey.state.value + (" ★" if reached else ""),
            gains=round(gains, 4),
            decay=round(decay, 4)
        ))

        if reached:
            journey.distance_to_next = 1.0

    return snapshots


def scenario_multi_journey(days: int = 60) -> dict:
    """Shows how capacity is shared across 2 journeys."""
    journey1 = Journey()  # Career
    journey2 = Journey()  # Health

    results = {"journey1": [], "journey2": []}

    for day in range(1, days + 1):
        # Alternate focus: 2 experiments career, 1 health
        exp1 = [
            Experiment(difficulty="medium", relevance=1.0),
            Experiment(difficulty="small", relevance=0.9)
        ]
        exp2 = [Experiment(difficulty="small", relevance=1.0)]

        events1 = DayEvents(experiments=exp1, engaged=True)
        events2 = DayEvents(experiments=exp2, engaged=True)

        gains1, decay1 = update_journey(journey1, events1)
        gains2, decay2 = update_journey(journey2, events2)

        results["journey1"].append(Snapshot(
            day=day,
            velocity=round(journey1.velocity, 3),
            momentum=round(journey1.momentum, 3),
            distance=round(journey1.distance_to_next, 3),
            milestones=journey1.milestones_reached,
            state="career",
            gains=round(gains1, 4),
            decay=round(decay1, 4)
        ))

        results["journey2"].append(Snapshot(
            day=day,
            velocity=round(journey2.velocity, 3),
            momentum=round(journey2.momentum, 3),
            distance=round(journey2.distance_to_next, 3),
            milestones=journey2.milestones_reached,
            state="health",
            gains=round(gains2, 4),
            decay=round(decay2, 4)
        ))

    return results


# =============================================================================
# MAIN
# =============================================================================

def print_scenario(name: str, snapshots: List[Snapshot], milestones: List[int] = None):
    print(f"\n{'='*70}")
    print(f"SCENARIO: {name}")
    print(f"{'='*70}")

    if milestones is None:
        milestones = [1, 7, 14, 21, 30, 45, 60, 75, 90]

    print(f"{'Day':>4} | {'Velocity':>8} | {'Momentum':>8} | {'Stars':>5} | {'State':>15} | {'Gain':>8}")
    print("-" * 70)

    for snap in snapshots:
        if snap.day in milestones or snap.day == len(snapshots):
            print(f"{snap.day:>4} | {snap.velocity:>8.3f} | {snap.momentum:>8.3f} | {snap.milestones:>5} | {snap.state:>15} | {snap.gains:>+8.4f}")

    final = snapshots[-1]
    print(f"\nFinal: velocity={final.velocity:.3f}, momentum={final.momentum:.3f}, milestones={final.milestones}")


def main():
    print("\n" + "="*70)
    print("THE WALK - JOURNEY SIMULATION")
    print("="*70)

    # Scenario 1: Ideal Journey
    results = scenario_ideal_journey(90)
    print_scenario("Ideal Journey (daily medium, milestone every 15d)", results)
    max_velocity = max(s.velocity for s in results)
    print(f"→ Peak velocity: {max_velocity:.3f}")

    # Scenario 2: Struggling Journey
    results = scenario_struggling_journey(90)
    print_scenario("Struggling Journey (40% completion)", results)
    print(f"→ Stalls detected: {sum(1 for s in results if 'STALL' in s.state)}")

    # Scenario 3: Momentum Acceleration
    results = scenario_momentum_acceleration(60)
    print_scenario("Momentum Acceleration (shows snowball effect)", results, [1, 10, 20, 30, 40, 50, 60])
    print(f"→ Day 1 momentum: {results[0].momentum:.3f}")
    print(f"→ Day 30 momentum: {results[29].momentum:.3f}")
    print(f"→ Day 60 momentum: {results[59].momentum:.3f}")

    # Scenario 4: Stall Recovery
    results = scenario_stall_recovery(45)
    print_scenario("Stall Recovery (10d active → 20d stall → recovery)", results,
                   [1, 10, 15, 20, 25, 30, 35, 40, 45])
    stall_start = next((s.day for s in results if 'STALL' in s.state), None)
    print(f"→ Stall detected at day: {stall_start}")

    # Scenario 5: Milestone Thrust Cascade
    results = scenario_milestone_thrust_cascade(30)
    print_scenario("Milestone Thrust Cascade (rapid milestones)", results, list(range(1, 31, 5)))
    print(f"→ Velocity at milestone 1: {results[5].velocity:.3f}")
    print(f"→ Velocity at milestone 5: {results[25].velocity:.3f}")

    # Scenario 6: Multi-Journey
    results = scenario_multi_journey(60)
    print("\n" + "="*70)
    print("SCENARIO: Multi-Journey (Career + Health)")
    print("="*70)
    print("\nCareer Journey (2 experiments/day):")
    print(f"  Day 30 velocity: {results['journey1'][29].velocity:.3f}")
    print(f"  Day 60 velocity: {results['journey1'][59].velocity:.3f}")
    print("\nHealth Journey (1 experiment/day):")
    print(f"  Day 30 velocity: {results['journey2'][29].velocity:.3f}")
    print(f"  Day 60 velocity: {results['journey2'][59].velocity:.3f}")

    print("\n" + "="*70)
    print("SIMULATION COMPLETE")
    print("="*70)


if __name__ == "__main__":
    main()
