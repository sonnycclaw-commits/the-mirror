# Compatibility System - SKIN

**System:** compatibility
**Lens:** SKIN (4/7)
**Created:** 2026-01-15
**Status:** Draft
**Depends on:** 01-skeleton.md, 02-blood.md

---

## Overview

This document stress-tests the Compatibility system by examining edge cases, boundary conditions, and adversarial scenarios. Each section identifies what can break, how it manifests, and required mitigations.

**Adversarial Mindset:**
- What happens at boundaries (0, 1, empty, max)?
- What if users are malicious?
- What if timing is pathological?
- What if data is incomplete or corrupt?

---

## 1. Privacy Edge Cases

### 1.1 User Hides ALL Stars

**Scenario:** User A sends invite to User B. User B accepts, then hides every star via privacy settings.

**What Breaks:**
- `detect_interactions()` returns empty list
- `compute_profile()` has zero interactions
- Dynamic type defaults to COMPLEX (no dominant pattern)
- Complement score may still compute (domain presence, not star visibility)

**Mitigation:**

```python
def validate_overlay_viability(user_a, user_b, privacy_a, privacy_b):
    """Check if overlay can produce meaningful results."""
    visible_a = get_visible_stars(user_a, privacy_a)
    visible_b = get_visible_stars(user_b, privacy_b)

    if len(visible_a) == 0 or len(visible_b) == 0:
        return OverlayViability.NO_VISIBLE_STARS

    # Check for domain overlap
    domains_a = {s.domain for s in visible_a}
    domains_b = {s.domain for s in visible_b}

    if len(domains_a & domains_b) == 0:
        return OverlayViability.NO_SHARED_DOMAINS

    return OverlayViability.VIABLE
```

**UX Response:**
- "This overlay cannot show interactions because [User] has hidden their constellation."
- Do NOT reveal which specific stars are hidden
- Still show that overlay exists (consent is valid)
- Allow user to request less restrictive privacy

### 1.2 One Revokes Mid-Computation

**Scenario:** User B revokes consent while overlay computation is in progress.

**Race Condition Timeline:**
```
T0: Computation starts
T1: User B clicks "Revoke"
T2: Computation completes
T3: System tries to cache result
T4: Revocation fully processed
```

**What Breaks:**
- Cached profile may persist after revocation
- InteractionLines reference deleted overlay
- Profile may be viewable momentarily after revoke

**Mitigation:**

```python
def cache_profile_safely(overlay_id, profile):
    """Atomic cache with revocation check."""
    with transaction():
        # Re-check overlay state INSIDE transaction
        overlay = Overlay.get(overlay_id, for_update=True)

        if overlay.state != OverlayState.COMPUTING:
            # State changed (revoked, paused, etc.) - discard result
            return CacheResult.DISCARDED

        # Only cache if still valid
        overlay.cached_profile_id = save_profile(profile)
        overlay.state = OverlayState.CACHED
        return CacheResult.SUCCESS
```

**Invariant:** Revocation must trigger immediate cache deletion, not wait for TTL.

### 1.3 Asymmetric Hiding (A Sees B, B Hides from A)

**Scenario:**
- User A: shows all stars
- User B: hides "Relationships" domain from overlays

**What Actually Happens:**
- Interactions computed only for {User A visible} x {User B visible}
- User A sees their own Relationships stars but NO interactions with B's
- User B sees no Relationships interactions (they hid them)

**Confusion Risk:** User A might wonder "Does B not care about relationships?" when actually B has many Relationships stars but chose to hide them.

**Mitigation:**

```python
def compute_profile_with_transparency(overlay, privacy_a, privacy_b):
    """Compute profile and indicate hidden dimensions."""
    profile = compute_profile(...)

    # Count what's hidden (without revealing specifics)
    hidden_a = count_hidden_stars(user_a, privacy_a)
    hidden_b = count_hidden_stars(user_b, privacy_b)

    profile.metadata = {
        "user_a_hiding": hidden_a > 0,
        "user_b_hiding": hidden_b > 0,
        "partial_view": hidden_a > 0 or hidden_b > 0
    }

    return profile
```

**UX Response:**
- "This profile reflects visible stars only. Some stars are hidden due to privacy settings."
- NEVER say "User B is hiding 3 stars in Relationships"
- NEVER reveal which domains are hidden

### 1.4 GDPR Deletion Request During Active Overlay

**Scenario:** User B submits GDPR "right to erasure" request while they have 5 active overlays.

**What Must Happen:**
1. All overlays involving User B -> immediate EXPIRED state
2. All InteractionLines referencing User B's stars -> hard delete
3. All cached profiles for User B's overlays -> hard delete
4. User B's stars -> hard delete
5. User A (and other partners) see: "Overlay unavailable"

**Timeline Constraint:** GDPR requires deletion within 30 days, but overlay data should be deleted IMMEDIATELY (hours, not days) for privacy.

**Mitigation:**

```python
def process_gdpr_deletion(user_id):
    """GDPR-compliant deletion cascade."""
    with transaction():
        # 1. Collect all affected overlays
        overlays = Overlay.where(
            (user_a_id == user_id) | (user_b_id == user_id)
        ).all()

        for overlay in overlays:
            # 2. Hard delete all interaction lines
            InteractionLine.where(overlay_id=overlay.id).delete()

            # 3. Hard delete cached profile
            if overlay.cached_profile_id:
                CompatibilityProfile.delete(overlay.cached_profile_id)

            # 4. Mark overlay expired (not deleted - audit trail)
            overlay.state = OverlayState.EXPIRED
            overlay.expired_reason = "user_deletion"
            overlay.anonymize()  # Remove user_id references

        # 5. Delete user's constellation (separate cascade)
        delete_constellation(user_id)
```

**Audit Trail:** Keep anonymized overlay records (for analytics) but remove all PII and interaction data.

### 1.5 Account Deletion with Active Overlays

**Scenario:** User voluntarily deletes account (not GDPR, but similar).

**Difference from GDPR:**
- Can keep aggregated statistics
- Can keep consent request history (anonymized)
- Faster processing expected (immediate)

**Partner Experience:**
- "This person is no longer using [App Name]"
- Overlay enters EXPIRED state
- No re-invite possible (user doesn't exist)
- After 30 days, request record deleted

---

## 2. Consent Edge Cases

### 2.1 Invite Spam

**Attack Vector:** Malicious user sends 1000 invites to different users.

**Why Dangerous:**
- Notification spam
- Database bloat
- Social engineering ("Why do 50 people want to connect with me?")

**Rate Limits:**

| Limit | Value | Scope | Reset |
|-------|-------|-------|-------|
| Invites per hour | 10 | Per user | Rolling |
| Invites per day | 30 | Per user | Daily |
| Pending invites | 50 | Per user | Until resolved |
| Invites to same person | 1 | Per user pair | Until resolved/expired |

**Mitigation:**

```python
def can_send_invite(inviter_id, invitee_id):
    """Rate limiting for invite spam prevention."""
    # Check existing relationship
    existing = CompatibilityRequest.where(
        inviter_id=inviter_id,
        invitee_id=invitee_id,
        state__not_in=[EXPIRED, NONE]
    ).exists()

    if existing:
        raise AlreadyInvitedError("Invite already exists")

    # Check hourly limit
    hourly_count = CompatibilityRequest.where(
        inviter_id=inviter_id,
        created_at__gte=now() - timedelta(hours=1)
    ).count()

    if hourly_count >= INVITE_HOURLY_LIMIT:
        raise RateLimitError("Too many invites (hourly)")

    # Check daily limit
    daily_count = CompatibilityRequest.where(
        inviter_id=inviter_id,
        created_at__gte=now() - timedelta(days=1)
    ).count()

    if daily_count >= INVITE_DAILY_LIMIT:
        raise RateLimitError("Too many invites (daily)")

    # Check pending limit
    pending_count = CompatibilityRequest.where(
        inviter_id=inviter_id,
        state__in=[INVITED, PENDING]
    ).count()

    if pending_count >= MAX_PENDING_INVITES:
        raise RateLimitError("Too many pending invites")

    return True
```

### 2.2 Re-Invite After Decline (Cooldown Handling)

**Scenario:** User A invites User B. User B declines. User A waits 89 days and invites again.

**Current State Machine:** DECLINED -> (90 days) -> NONE

**Edge Cases:**
1. What if A tries at day 89? Error: "Wait 1 more day"
2. What if A tries at exactly day 90? Allowed
3. What if B blocked A in another system? Should override cooldown to permanent

**Mitigation:**

```python
def can_reinvite(inviter_id, invitee_id):
    """Check if re-invite is allowed after decline."""
    # Find most recent declined request
    declined = CompatibilityRequest.where(
        inviter_id=inviter_id,
        invitee_id=invitee_id,
        state=DECLINED
    ).order_by('-responded_at').first()

    if not declined:
        return True  # No history of decline

    cooldown_end = declined.responded_at + timedelta(days=90)

    if now() < cooldown_end:
        remaining = cooldown_end - now()
        raise CooldownError(f"Re-invite available in {remaining.days} days")

    # Check for repeated declines (escalating cooldown)
    decline_count = CompatibilityRequest.where(
        inviter_id=inviter_id,
        invitee_id=invitee_id,
        state=DECLINED
    ).count()

    if decline_count >= MAX_DECLINE_ATTEMPTS:
        raise PermanentBlockError("Too many declined invites")

    return True
```

**Constants:**

| Constant | Value | Description |
|----------|-------|-------------|
| BASE_DECLINE_COOLDOWN | 90 days | First decline |
| MAX_DECLINE_ATTEMPTS | 3 | After this, permanent block |
| ESCALATING_COOLDOWN | 90 * 2^n days | Each subsequent decline doubles |

### 2.3 Paused Overlay for 6+ Months

**Scenario:** User A pauses overlay, then forgets about it. 180 days pass.

**Current State Machine:** PAUSED -> (60 days) -> EXPIRED

**But what if policy says 180 days?**

**Issues:**
1. User A's constellation may have changed dramatically
2. Cached profile is extremely stale
3. User B may have forgotten the relationship exists

**Mitigation:**

```python
def resume_stale_overlay(overlay_id, resumer_id):
    """Handle resume after long pause."""
    overlay = Overlay.get(overlay_id)

    if overlay.pauser_id != resumer_id:
        raise UnauthorizedError("Only pauser can resume")

    pause_duration = now() - overlay.paused_at

    if pause_duration > timedelta(days=60):
        # Auto-expired
        raise ExpiredError("Overlay expired due to extended pause")

    if pause_duration > timedelta(days=30):
        # Stale warning
        overlay.metadata['stale_warning'] = True
        # Force fresh computation on next view
        overlay.state = OverlayState.INVALIDATED

    overlay.state = OverlayState.READY
    overlay.pauser_id = None
    overlay.paused_at = None

    # Notify partner that overlay resumed
    notify_partner(overlay, "overlay_resumed")

    return overlay
```

### 2.4 User Changes Dramatically During Pause

**Scenario:** User A pauses at day 0. By day 59, User B has:
- Added 10 new stars
- Changed brightness on 5 stars
- Deleted 3 stars

**On Resume:**
- Cached profile is invalidated (correct)
- New computation reflects new state (correct)
- But: No notification to User A that "things have changed"

**Mitigation:**

```python
def resume_with_change_summary(overlay_id, resumer_id):
    """Resume and summarize what changed."""
    overlay = resume_overlay(overlay_id, resumer_id)

    # Compare snapshots
    snapshot_at_pause = overlay.metadata.get('snapshot_at_pause')
    current_state = get_constellation_fingerprint(overlay.partner_id(resumer_id))

    changes = compute_change_summary(snapshot_at_pause, current_state)

    if changes.significant:
        overlay.metadata['changes_during_pause'] = {
            'stars_added': changes.added_count,
            'stars_removed': changes.removed_count,
            'domains_changed': changes.domains_affected
        }

    return overlay
```

**Change Summary (Privacy-Preserving):**
- "Partner's constellation has changed since pause"
- NOT: "Partner added 3 stars in Relationships"

---

## 3. Data Edge Cases

### 3.1 No Overlapping Domains

**Scenario:**
- User A's stars: {Purpose, Wealth, Career}
- User B's stars: {Health, Soul, Relationships}
- Zero domain overlap

**What Happens:**
- Zero direct interactions (RESONANCE, TENSION, GROWTH_EDGE, SHADOW_MIRROR)
- Complement score CAN still compute (measures domain coverage balance)
- Dynamic type: BALANCING (if complement high) or COMPLEX

**Formula Check (from BLOOD):**

```python
def calculate_complement_score(user_a, user_b, ...):
    # domains_a = {Purpose, Wealth, Career}
    # domains_b = {Health, Soul, Relationships}
    # all_domains = {Purpose, Wealth, Career, Health, Soul, Relationships} (6 total)

    # For each domain, check if one strong, other weak
    # Since domains are disjoint:
    # - A is "present" (potentially strong) in Purpose, Wealth, Career
    # - B is "absent" (definitely weak, 0) in Purpose, Wealth, Career
    # - B is "present" (potentially strong) in Health, Soul, Relationships
    # - A is "absent" (definitely weak, 0) in Health, Soul, Relationships

    # This COULD produce high complement if:
    # - A is strong in their domains
    # - B is strong in their domains
    # - Together they "cover" all domains
```

**Edge Case:** What if both have only 1 star each?

```
User A: 1 star in Purpose (0.8)
User B: 1 star in Health (0.7)

all_domains = {Purpose, Health}
A strong in Purpose (0.8 >= 0.65), B weak (0)
B strong in Health (0.7 >= 0.65), A weak (0)

complement_pairs = 2
coverage_pairs = 2
raw_score = 2/2 = 1.0
```

**Risk:** Two users with 1 star each in different domains get "perfect complement" score - misleading.

**Mitigation:**

```python
def calculate_complement_score_safe(user_a, user_b, privacy_a, privacy_b):
    """Complement with minimum data requirements."""
    domains_a = get_domain_strengths(user_a, privacy_a)
    domains_b = get_domain_strengths(user_b, privacy_b)

    all_domains = set(domains_a.keys()) | set(domains_b.keys())

    # Require minimum domain count
    if len(all_domains) < MIN_DOMAINS_FOR_COMPLEMENT:
        return None  # Insufficient data

    # Require minimum shared domains for meaningful comparison
    shared_domains = set(domains_a.keys()) & set(domains_b.keys())

    if len(shared_domains) < MIN_SHARED_FOR_COMPARISON:
        # Can still compute, but flag as low confidence
        confidence_penalty = 0.5
    else:
        confidence_penalty = 1.0

    score = calculate_complement_score(...)  # Original formula

    return score * confidence_penalty
```

**Constants:**

| Constant | Value | Description |
|----------|-------|-------------|
| MIN_DOMAINS_FOR_COMPLEMENT | 3 | Need breadth for complement |
| MIN_SHARED_FOR_COMPARISON | 1 | At least one shared domain |

### 3.2 All Stars Same Brightness (No Variance)

**Scenario:** Both users have all stars at exactly 0.5 brightness.

**Formula Behavior:**
- is_shadow_mirror(0.5, 0.5): 0.5 > 0.4 -> False
- is_tension(0.5, 0.5): gap = 0 < 0.4 -> False
- is_growth_edge(0.5, 0.5): 0.5 < 0.6 (mentor threshold) -> False
- is_resonance(0.5, 0.5): 0.5 < 0.6 -> False

**Result:** ZERO interactions detected, despite having stars in same domains!

**The "Dead Zone":**

```
         SHADOW       TENSION/GROWTH       RESONANCE
         [0, 0.4]     [gap >= 0.4]         [0.6, 1.0]
           |              |                   |
    0.0 ---+--- 0.4 -----+--- 0.6 -----------+--- 1.0
                       ^^^^^
                    DEAD ZONE
                   [0.4, 0.6] both
                   gap < 0.4
```

Stars in dead zone:
- 0.45 and 0.55: gap = 0.1 (no interaction)
- 0.5 and 0.5: gap = 0 (no interaction)

**Mitigation Option A: Expand Categories**

```python
def is_steady_state(brightness_a, brightness_b):
    """Both in stable middle zone - not dramatic, but worth noting."""
    in_middle_a = STEADY_MIN <= brightness_a <= STEADY_MAX
    in_middle_b = STEADY_MIN <= brightness_b <= STEADY_MAX
    gap = abs(brightness_a - brightness_b)

    return in_middle_a and in_middle_b and gap < TENSION_GAP_THRESHOLD
```

**Mitigation Option B: Accept and Explain**

```python
def explain_no_interactions(visible_pairs, interactions):
    """Generate explanation when few/no interactions found."""
    if len(interactions) == 0 and len(visible_pairs) > 0:
        return {
            "reason": "STABLE_MIDDLE",
            "explanation": "Both constellations are in balanced states. "
                          "No dramatic patterns emerge, which indicates "
                          "a stable, even dynamic."
        }
```

**Design Decision:** The "dead zone" is intentional - moderate brightness pairs are unremarkable. But UX should explain this, not show empty profile.

### 3.3 Asymmetric Constellation Size

**Scenario:** User A has 3 stars, User B has 30 stars.

**Issues:**
1. A has max 3 interactions, B has "unused" stars
2. Profile heavily biased by A's small sample
3. Complement calculation skewed

**Example:**
```
User A: 3 stars in {Health, Purpose, Wealth}
User B: 30 stars across all domains, 6 in each

Interactions: At most 3 (one per A's star)
- Might be 3 RESONANCE if both bright
- Profile: 100% resonance (but only 3 data points)
```

**Confidence Penalty:**

```python
def calculate_size_confidence(stars_a, stars_b):
    """Confidence based on constellation sizes."""
    size_a = len(stars_a)
    size_b = len(stars_b)

    # Minimum for meaningful comparison
    if min(size_a, size_b) < MIN_STARS_FOR_CONFIDENCE:
        return MIN_SIZE_CONFIDENCE

    # Ratio penalty (very asymmetric = less confident)
    ratio = min(size_a, size_b) / max(size_a, size_b)

    if ratio < SIZE_RATIO_PENALTY_THRESHOLD:
        ratio_penalty = ratio / SIZE_RATIO_PENALTY_THRESHOLD
    else:
        ratio_penalty = 1.0

    # Combined
    base_confidence = min(size_a + size_b, CONFIDENCE_CEILING_SIZE) / CONFIDENCE_CEILING_SIZE

    return base_confidence * ratio_penalty
```

**Constants:**

| Constant | Value | Description |
|----------|-------|-------------|
| MIN_STARS_FOR_CONFIDENCE | 5 | Below this, low confidence |
| MIN_SIZE_CONFIDENCE | 0.4 | Floor for tiny constellations |
| SIZE_RATIO_PENALTY_THRESHOLD | 0.3 | Ratio below this penalized |
| CONFIDENCE_CEILING_SIZE | 20 | Beyond this, no additional confidence |

### 3.4 Both Constellations All-Dark

**Scenario:** Both users in crisis - all stars below 0.4.

**Formula Behavior:**
- Every pair: SHADOW_MIRROR (both <= 0.4)
- Dynamic type: MIRRORING (shadow_mirrors > 30%)
- Profile: 100% shadow mirrors

**Clinical Concern:** Two struggling users connecting over shared darkness could be harmful (mutual reinforcement of negative states) or helpful (solidarity, understanding).

**Mitigation:**

```python
def check_clinical_flags(profile):
    """Flag profiles that may need clinical consideration."""
    flags = []

    # All shadow mirrors
    if profile.shadow_mirrors_percent >= CLINICAL_SHADOW_THRESHOLD:
        flags.append(ClinicalFlag.HIGH_SHADOW_MIRROR)

    # Low brightness both users
    if profile.avg_brightness_a < CLINICAL_LOW_BRIGHTNESS and \
       profile.avg_brightness_b < CLINICAL_LOW_BRIGHTNESS:
        flags.append(ClinicalFlag.DUAL_LOW_BRIGHTNESS)

    return flags

def generate_narrative_with_flags(profile, flags):
    """Adjust narrative generation based on clinical flags."""
    if ClinicalFlag.HIGH_SHADOW_MIRROR in flags:
        # Include support resources
        profile.narrative_additions = [
            "Both of you are navigating challenging times in similar areas.",
            "This shared understanding can be a source of support.",
            "Consider: [link to support resources]"
        ]
```

**Constants:**

| Constant | Value | Description |
|----------|-------|-------------|
| CLINICAL_SHADOW_THRESHOLD | 0.70 | 70%+ shadow mirrors |
| CLINICAL_LOW_BRIGHTNESS | 0.35 | Average below this |

### 3.5 Star Deleted During Overlay Computation

**Scenario:**
1. Computation starts, reads User A's star S1
2. User A deletes star S1
3. Computation tries to save interaction referencing S1

**What Breaks:**
- Foreign key violation (star_a_id references deleted star)
- Inconsistent state (profile computed with non-existent star)

**Mitigation:**

```python
def detect_interactions_safe(overlay, privacy_a, privacy_b):
    """Interaction detection with deletion protection."""
    # Snapshot star IDs at start
    star_ids_a = {s.id for s in get_visible_stars(overlay.user_a, privacy_a)}
    star_ids_b = {s.id for s in get_visible_stars(overlay.user_b, privacy_b)}

    interactions = []

    for star_a in get_stars_by_ids(star_ids_a):
        for star_b in get_stars_by_ids(star_ids_b):
            # ... detection logic ...
            interaction = detect_interaction_type(star_a, star_b, ...)
            if interaction:
                interactions.append(interaction)

    # Before saving, verify all stars still exist
    with transaction():
        existing_a = Star.where(id__in=star_ids_a).values_list('id', flat=True)
        existing_b = Star.where(id__in=star_ids_b).values_list('id', flat=True)

        valid_interactions = [
            i for i in interactions
            if i.star_a_id in existing_a and i.star_b_id in existing_b
        ]

        if len(valid_interactions) < len(interactions):
            # Some stars deleted - log and continue with valid subset
            log_warning("Stars deleted during computation",
                       deleted_count=len(interactions) - len(valid_interactions))

        save_interactions(valid_interactions)
```

---

## 4. Group Edge Cases (N>2)

### 4.1 One Member Revokes in 5-Person Group

**Scenario:** Group overlay with A, B, C, D, E. User C revokes.

**Options:**
1. **Dissolve entire group** - Strictest, but punishes 4 for 1's choice
2. **Continue with N-1** - Group becomes A, B, D, E
3. **Revert to pairwise** - Show remaining pairs but not group profile

**Recommended: Option 2 with conditions**

```python
def handle_group_revocation(group_overlay_id, revoking_user_id):
    """Handle single-member revocation from group."""
    group = GroupOverlay.get(group_overlay_id)

    # Remove revoking user
    group.members.remove(revoking_user_id)
    remaining = len(group.members)

    # Check minimum group size
    if remaining < MIN_GROUP_SIZE:
        # Convert to pairwise or dissolve
        if remaining == 2:
            # Convert to standard overlay
            return convert_to_pairwise(group)
        else:
            # Dissolve (only 1 member left)
            return dissolve_group(group)

    # Recompute group profile without revoking user
    invalidate_group_profile(group)

    # Delete all interaction lines involving revoking user
    InteractionLine.where(
        group_id=group.id,
        star_owner_id=revoking_user_id
    ).delete()

    # Notify remaining members
    for member_id in group.members:
        notify_user(member_id, "group_member_left", {
            "group_id": group.id,
            "remaining_count": remaining
        })

    return group
```

**Privacy Note:** Don't reveal WHO revoked, just that someone did.

### 4.2 Pairwise Conflicts in Group

**Scenario:**
- A+B = AMPLIFYING (mostly resonances)
- B+C = CHALLENGING (mostly tensions)
- A+C = GROWTH (mostly growth edges)

**What is the GROUP dynamic type?**

**Aggregation Approaches:**

**Option A: Weighted Average (Current BLOOD approach)**
```python
# If each pair has equal interaction counts:
# resonances: 33%, tensions: 33%, growth: 33%
# No type exceeds threshold -> COMPLEX
```

**Option B: Conflict Detection**
```python
def detect_group_conflicts(pairwise_profiles):
    """Identify conflicting dynamics within group."""
    conflicts = []

    types = [p.dynamic_type for p in pairwise_profiles]

    # Direct conflicts
    if DynamicType.AMPLIFYING in types and DynamicType.CHALLENGING in types:
        conflicts.append(GroupConflict.AMPLIFY_CHALLENGE)

    if DynamicType.GROWTH in types and DynamicType.MIRRORING in types:
        conflicts.append(GroupConflict.GROWTH_MIRROR)

    return conflicts
```

**Option C: Sub-Group Identification**
```python
def identify_subgroups(pairwise_profiles, members):
    """Find natural clusters within group."""
    # Build affinity graph
    affinity = {}
    for p in pairwise_profiles:
        a, b = p.users
        # High affinity if AMPLIFYING or GROWTH
        if p.dynamic_type in [DynamicType.AMPLIFYING, DynamicType.GROWTH]:
            affinity[(a, b)] = 1.0
        elif p.dynamic_type == DynamicType.CHALLENGING:
            affinity[(a, b)] = 0.2
        else:
            affinity[(a, b)] = 0.5

    # Cluster analysis (e.g., spectral clustering)
    clusters = find_clusters(members, affinity)

    return clusters  # e.g., [{A, B}, {C}] if A-B strong, C in tension with both
```

**Recommended:** Show both group aggregate AND highlight conflicts.

```
Group Dynamic: COMPLEX (mixed)
Notable patterns:
- A and B: Strong resonance
- B and C: Significant tension
- This may create a bridging dynamic where B mediates between A and C.
```

### 4.3 Group of 20+ (Performance, UX)

**Scenario:** User wants to create compatibility overlay for their team of 25 people.

**Performance:**
```
Pairs: 25 * 24 / 2 = 300 pairwise comparisons
Stars per user: ~15 average
Star pairs per dyad: ~10 (in shared domains)
Total star pairs: 300 * 10 = 3,000
Computations: O(3000) = acceptable

But: 300 profiles to aggregate = UX nightmare
```

**UX Issues:**
1. Can't display 300 interaction lines meaningfully
2. Individual contributions lost in aggregate
3. Consent management with 25 people is chaotic

**Mitigation:**

```python
MAX_GROUP_SIZE = 10  # Hard limit

def create_group_overlay(member_ids):
    """Create group overlay with size limits."""
    if len(member_ids) > MAX_GROUP_SIZE:
        raise GroupTooLargeError(
            f"Groups limited to {MAX_GROUP_SIZE} members. "
            f"Consider creating sub-groups."
        )

    # ... rest of creation logic
```

**Alternative for Large Groups:**

```python
def create_hierarchical_groups(member_ids, target_size=5):
    """For large groups, suggest sub-group structure."""
    if len(member_ids) <= MAX_GROUP_SIZE:
        return [member_ids]  # Single group

    # Suggest clustering based on existing data (if any)
    # Or suggest random/user-selected partitions
    suggested_partitions = []

    for i in range(0, len(member_ids), target_size):
        partition = member_ids[i:i+target_size]
        suggested_partitions.append(partition)

    return suggested_partitions
```

**Limits:**

| Limit | Value | Rationale |
|-------|-------|-----------|
| MAX_GROUP_SIZE | 10 | UX manageable, performance acceptable |
| SUGGESTED_SUBGROUP_SIZE | 5 | Optimal for pattern detection |
| MIN_GROUP_SIZE | 3 | Below this, use pairwise |

---

## 5. Formula Boundaries

### 5.1 Strength at Exactly 0 and 1

**Edge Cases:**
- `brightness = 0.0` (minimum possible)
- `brightness = 1.0` (maximum possible)

**Division by Zero in Harmonic Mean:**

```python
def calculate_brightness_factor(brightness_a, brightness_b):
    # DANGER: Division by zero if brightness = 0
    harmonic_mean = 2 / (1/brightness_a + 1/brightness_b)  # BOOM
```

**Mitigation:**

```python
def calculate_brightness_factor_safe(brightness_a, brightness_b):
    """Brightness factor with zero protection."""
    # Enforce minimum brightness
    safe_a = max(brightness_a, MIN_BRIGHTNESS_VALUE)
    safe_b = max(brightness_b, MIN_BRIGHTNESS_VALUE)

    # Now safe to compute harmonic mean
    harmonic_mean = 2 / (1/safe_a + 1/safe_b)

    return BRIGHTNESS_FACTOR_MIN + harmonic_mean * BRIGHTNESS_FACTOR_RANGE
```

**Constants:**

| Constant | Value | Description |
|----------|-------|-------------|
| MIN_BRIGHTNESS_VALUE | 0.05 | Floor for computations |
| MAX_BRIGHTNESS_VALUE | 1.0 | Ceiling (natural) |

**At brightness = 1.0:**
- `excess_a = (1.0 - 0.6) / 0.4 = 1.0` (resonance formula)
- `sqrt(1.0 * 1.0) = 1.0`
- `strength = 0.35 + 1.0 * 0.55 = 0.9` (maximum resonance)

**No issue at 1.0** - formulas naturally cap at reasonable values.

### 5.2 Division by Zero Risks (Comprehensive Audit)

**All division operations in BLOOD:**

| Formula | Division | Risk | Mitigation |
|---------|----------|------|------------|
| Harmonic mean | `1/brightness` | Zero brightness | MIN_BRIGHTNESS_VALUE |
| Darkness calculation | `(threshold - b) / threshold` | threshold=0 | Threshold is constant (0.4) |
| Excess gap | `excess / max_excess` | max_excess=0 | max_excess = 0.5 (constant) |
| Mentor factor | `(b - threshold) / (1.0 - threshold)` | threshold=1.0 | Threshold is 0.6 (constant) |
| Mentee factor | `distance / (range/2)` | range=0 | Range is 0.25 (constant) |
| Profile percentages | `count / total_weight` | total_weight=0 | Check before division |
| Complement score | `pairs / domains` | domains=0 | Check all_domains not empty |
| Confidence | `gap * scale` | No division | N/A |

**Comprehensive Safeguard:**

```python
def safe_divide(numerator, denominator, default=0.0):
    """Safe division with explicit default."""
    if denominator == 0:
        return default
    return numerator / denominator
```

### 5.3 Certainty Floor (Both Blurred)

**From BLOOD:**
```python
BLUR_CERTAINTY = 0.75
MIN_CERTAINTY = 0.5

# Both blurred: 0.75 * 0.75 = 0.5625, floored to 0.5
```

**Is 0.5 too aggressive?**

**Scenario Analysis:**
```
User A: BRIGHT state (true brightness 0.85)
User B: BRIGHT state (true brightness 0.72)

Blurred values: 0.85 (midpoint of BRIGHT range), 0.85
True interaction: RESONANCE with strength ~0.65

Blurred computation:
- Both at 0.85 (blurred) -> RESONANCE
- Strength calculation uses 0.85 for both
- Strength ~0.76 (higher than true because both at midpoint)
- Certainty: 0.5
- Final strength: 0.76 * 0.5 = 0.38

True strength would be: ~0.65

Blurred result: 0.38 (underestimates due to certainty penalty)
```

**Trade-off:**
- 0.5 certainty is conservative (underestimates strength)
- Better than overestimating and showing false confidence
- User sees "reduced confidence due to privacy settings"

**Alternative: Dynamic Certainty Based on State Agreement**

```python
def calculate_dynamic_certainty(star_a, star_b, privacy_a, privacy_b):
    """Certainty varies by how states align with computation."""
    base_certainty = 1.0

    if privacy_a.blur_brightness:
        # Certainty depends on state width
        state_a = star_a.state
        range_a = STATE_RANGES[state_a][1] - STATE_RANGES[state_a][0]
        # Wider range = more uncertainty
        base_certainty *= (1.0 - range_a * 0.5)

    if privacy_b.blur_brightness:
        state_b = star_b.state
        range_b = STATE_RANGES[state_b][1] - STATE_RANGES[state_b][0]
        base_certainty *= (1.0 - range_b * 0.5)

    return max(base_certainty, MIN_CERTAINTY)
```

**State Ranges for Reference:**
```
BRIGHT: 0.7-1.0 (range 0.3) -> penalty 0.85
STEADY: 0.5-0.7 (range 0.2) -> penalty 0.90
FLICKERING: 0.3-0.5 (range 0.2) -> penalty 0.90
DIM: 0.15-0.3 (range 0.15) -> penalty 0.925
DARK: 0.05-0.15 (range 0.1) -> penalty 0.95
```

---

## 6. Graceful Degradation

### 6.1 One Constellation Unavailable

**Scenarios:**
- Database read failure for User B's constellation
- User B's constellation corrupted (data integrity failure)
- User B deleted constellation (but account exists)

**Detection:**

```python
def load_constellations_for_overlay(overlay):
    """Load both constellations with error handling."""
    try:
        constellation_a = load_constellation(overlay.user_a_id)
    except ConstellationNotFoundError:
        return OverlayError.USER_A_CONSTELLATION_MISSING
    except DatabaseError:
        return OverlayError.DATABASE_ERROR

    try:
        constellation_b = load_constellation(overlay.user_b_id)
    except ConstellationNotFoundError:
        return OverlayError.USER_B_CONSTELLATION_MISSING
    except DatabaseError:
        return OverlayError.DATABASE_ERROR

    return (constellation_a, constellation_b)
```

**UX Response:**

| Error | Message to User A | Message to User B |
|-------|-------------------|-------------------|
| B missing | "Partner's constellation unavailable" | (N/A - they don't have one) |
| A missing | (N/A) | "Partner's constellation unavailable" |
| DB error | "Temporary error - try again" | "Temporary error - try again" |

**Retry Policy:**
- Transient errors: Retry 3x with exponential backoff
- Permanent errors (missing): Mark overlay ERROR, notify user

### 6.2 Historical Data Missing

**Scenario:** Star history table corrupted/missing. Stars exist but trend data lost.

**Impact:**
- Brightness decay can't reference history
- Can't show "User B's Health star was bright last month"
- Current snapshot still works

**Graceful Fallback:**

```python
def get_star_with_history(star_id):
    """Get star with optional history."""
    star = Star.get(star_id)

    try:
        star.history = StarHistory.where(star_id=star_id).order_by('-timestamp').all()
    except (DatabaseError, TableNotFoundError):
        star.history = []  # Empty history, current state still valid
        star.metadata['history_unavailable'] = True

    return star
```

**Profile Impact:**
- No impact on current compatibility computation
- Trend-based features degraded (e.g., "getting brighter together")
- Narrative generation has less context

### 6.3 Computation Timeout

**Scenario:** Group of 8 users, each with 20 stars. Computation exceeds timeout.

**Detection:**

```python
COMPUTATION_TIMEOUT = timedelta(seconds=30)

async def compute_profile_with_timeout(overlay):
    """Compute with timeout protection."""
    try:
        result = await asyncio.wait_for(
            compute_profile_async(overlay),
            timeout=COMPUTATION_TIMEOUT.total_seconds()
        )
        return result
    except asyncio.TimeoutError:
        # Log for investigation
        log_error("Computation timeout",
                 overlay_id=overlay.id,
                 user_count=overlay.member_count,
                 star_count=sum(len(m.stars) for m in overlay.members))

        return ComputationResult.TIMEOUT
```

**Fallback Strategy:**

```python
def compute_with_fallback(overlay):
    """Try full computation, fall back to sampling."""
    result = compute_profile_with_timeout(overlay)

    if result == ComputationResult.TIMEOUT:
        # Strategy 1: Reduce precision
        result = compute_profile_sampled(overlay, sample_rate=0.5)

    if result == ComputationResult.TIMEOUT:
        # Strategy 2: Compute only strongest interactions
        result = compute_profile_top_k(overlay, k=50)

    if result == ComputationResult.TIMEOUT:
        # Strategy 3: Give up gracefully
        return PartialProfile(
            status="incomplete",
            message="Profile computation timed out. Try again or reduce group size.",
            partial_data=get_cached_partial(overlay)
        )

    return result
```

**Timeout Constants:**

| Constant | Value | Description |
|----------|-------|-------------|
| COMPUTATION_TIMEOUT | 30s | Max time for single computation |
| SAMPLED_RATE | 0.5 | Compare 50% of star pairs |
| TOP_K_INTERACTIONS | 50 | Only strongest interactions |

---

## 7. Gaming/Abuse Prevention

### 7.1 Fake Accounts for Favorable Overlay

**Attack:** Create fake account with stars designed to produce AMPLIFYING dynamic with target.

**Detection:**

```python
def detect_sybil_accounts(user_id):
    """Detect likely fake accounts for compatibility gaming."""
    flags = []

    user = User.get(user_id)

    # Flag 1: New account with immediate overlay activity
    if user.created_at > now() - timedelta(days=7):
        overlay_count = Overlay.where(user_a_id=user_id).count() + \
                       Overlay.where(user_b_id=user_id).count()
        if overlay_count > SUSPICIOUS_OVERLAY_COUNT_NEW_ACCOUNT:
            flags.append(SybilFlag.RAPID_OVERLAY_CREATION)

    # Flag 2: Constellation too "perfect" (all stars same brightness)
    stars = user.constellation.stars
    brightnesses = [s.brightness for s in stars]
    if len(set(brightnesses)) == 1 and len(brightnesses) > 3:
        flags.append(SybilFlag.UNIFORM_BRIGHTNESS)

    # Flag 3: Stars never decay (no engagement, just static)
    stale_stars = [s for s in stars if s.last_interaction < now() - timedelta(days=30)]
    if len(stale_stars) == len(stars) and len(stars) > 0:
        flags.append(SybilFlag.NO_ENGAGEMENT)

    # Flag 4: Only overlay activity, no other app usage
    if user.overlay_actions > 10 and user.other_actions == 0:
        flags.append(SybilFlag.OVERLAY_ONLY_USAGE)

    return flags
```

**Response:**

```python
def enforce_sybil_protection(user_id, action):
    """Gate certain actions on sybil score."""
    flags = detect_sybil_accounts(user_id)

    if len(flags) >= SYBIL_THRESHOLD:
        if action == "send_invite":
            raise SybilBlockError(
                "Account activity patterns require verification. "
                "Please engage with your constellation before sending invites."
            )
```

**Constants:**

| Constant | Value | Description |
|----------|-------|-------------|
| SUSPICIOUS_OVERLAY_COUNT_NEW_ACCOUNT | 5 | Overlays in first week |
| SYBIL_THRESHOLD | 2 | Flags needed to block |

### 7.2 Manipulating Brightness for Better Compatibility

**Attack:** User artificially inflates brightness before overlay to appear more compatible.

**Example:**
```
True state: Health star at 0.3 (DIM)
User rapidly logs activities to boost to 0.7
Now shows RESONANCE instead of TENSION with partner who is at 0.75
```

**Detection:**

```python
def detect_brightness_gaming(star, lookback_days=7):
    """Detect suspicious brightness changes before overlay activity."""
    # Get recent history
    history = StarHistory.where(
        star_id=star.id,
        timestamp__gte=now() - timedelta(days=lookback_days)
    ).order_by('timestamp').all()

    if len(history) < 2:
        return None

    # Calculate rate of change
    start_brightness = history[0].brightness
    end_brightness = history[-1].brightness
    change = end_brightness - start_brightness

    # Flag rapid positive changes
    if change > SUSPICIOUS_BRIGHTNESS_CHANGE:
        # Check if overlay activity in same period
        overlay_activity = OverlayEvent.where(
            user_id=star.user_id,
            timestamp__gte=now() - timedelta(days=lookback_days)
        ).exists()

        if overlay_activity:
            return GamingFlag.SUSPICIOUS_BRIGHTNESS_BOOST

    return None
```

**Response Options:**

1. **Transparency:** Show partner "This star changed significantly recently"
2. **Delay:** Use 7-day rolling average instead of current brightness
3. **Warning:** Flag profile as "constellation recently changed"

**Recommended:** Option 3 (warning) - don't punish legitimate growth, but signal uncertainty.

### 7.3 Stalking via Compatibility Requests

**Attack:** Abuser repeatedly sends compatibility invites to monitor target's activity (even if declined, they see "invite viewed").

**Detection:**

```python
def detect_stalking_pattern(inviter_id, invitee_id):
    """Detect potential stalking via repeated invites."""
    history = CompatibilityRequest.where(
        inviter_id=inviter_id,
        invitee_id=invitee_id
    ).all()

    # Count declined + expired
    rejected_count = sum(1 for r in history if r.state in [DECLINED, EXPIRED])

    if rejected_count >= STALKING_THRESHOLD:
        return StalkingFlag.REPEATED_REJECTED_INVITES

    # Check time pattern (rapid re-invites after cooldown)
    if len(history) >= 2:
        intervals = []
        sorted_history = sorted(history, key=lambda r: r.created_at)
        for i in range(1, len(sorted_history)):
            interval = sorted_history[i].created_at - sorted_history[i-1].responded_at
            if sorted_history[i-1].responded_at:
                intervals.append(interval)

        # Re-inviting exactly at cooldown end = suspicious
        if any(timedelta(days=89) <= i <= timedelta(days=92) for i in intervals):
            return StalkingFlag.COOLDOWN_GAMING

    return None
```

**Protection:**

```python
def can_see_invite_status(inviter_id, request_id):
    """Limit what inviter can see about invite."""
    request = CompatibilityRequest.get(request_id)

    # Inviter should NOT see:
    # - Exact time invite was viewed
    # - How many times invitee looked at it
    # - Invitee's activity status

    # Inviter CAN see:
    # - Pending (invitee hasn't responded)
    # - Accepted
    # - Declined
    # - Expired

    # Specifically block:
    if request.state == PENDING:
        # Don't reveal viewed_at
        return InviteStatus(state="pending", viewed_at=None)

    return InviteStatus(state=request.state.value)
```

**Permanent Block:**

```python
def apply_permanent_block(blocker_id, blocked_id):
    """One user can permanently block another from all overlays."""
    Block.create(
        blocker_id=blocker_id,
        blocked_id=blocked_id,
        created_at=now()
    )

    # Terminate any existing overlays
    Overlay.where(
        (user_a_id == blocker_id, user_b_id == blocked_id) |
        (user_a_id == blocked_id, user_b_id == blocker_id)
    ).update(state=OverlayState.REVOKED)

    # Prevent future invites (both directions)
    # Enforced in can_send_invite()
```

---

## 8. Summary: Mitigations Table

| Edge Case | Risk Level | Mitigation | Implementation Priority |
|-----------|------------|------------|------------------------|
| Hide all stars | Medium | Viability check, UX explanation | P1 |
| Revoke mid-computation | High | Atomic cache with state check | P0 |
| Asymmetric hiding | Low | Transparency flag, no specifics | P2 |
| GDPR deletion | High | Immediate cascade delete | P0 |
| Invite spam | Medium | Rate limits, pending cap | P1 |
| Re-invite cooldown | Low | Escalating cooldowns | P2 |
| Stale pause | Low | Auto-expire, change summary | P2 |
| No overlapping domains | Medium | Viability check, complement fallback | P1 |
| All same brightness | Low | UX explanation for dead zone | P2 |
| Asymmetric size | Medium | Confidence penalty | P1 |
| Both all-dark | Medium | Clinical flags, resources | P1 |
| Star deleted mid-compute | High | Transaction, existence check | P0 |
| Group revocation | Medium | N-1 continuation, notify | P1 |
| Pairwise conflicts | Low | Conflict detection, subgroups | P3 |
| Large groups | Medium | Hard cap, suggest subgroups | P1 |
| Division by zero | High | MIN_BRIGHTNESS_VALUE, safe_divide | P0 |
| Certainty floor | Low | Current 0.5 acceptable | P3 |
| Constellation unavailable | High | Fallback, retry, error states | P0 |
| History missing | Low | Graceful fallback to current | P2 |
| Computation timeout | Medium | Sampling, top-k fallback | P1 |
| Fake accounts | Medium | Sybil detection, gating | P1 |
| Brightness gaming | Low | Warning flag, rolling average | P2 |
| Stalking | High | Repeated rejection detection, block | P0 |

---

## 9. Test Scenarios for QA

```python
# Edge case test matrix

class TestPrivacyEdgeCases:
    def test_all_stars_hidden_returns_no_viable(self):
        """User hides all stars -> overlay not viable."""

    def test_revoke_during_compute_discards_result(self):
        """Revocation mid-computation doesn't cache stale data."""

    def test_asymmetric_hiding_no_leak(self):
        """Hidden domains not revealed to partner."""

class TestConsentEdgeCases:
    def test_rate_limit_invites_per_hour(self):
        """11th invite in hour blocked."""

    def test_escalating_cooldown_after_multiple_declines(self):
        """Third decline = 360 day cooldown."""

    def test_pause_auto_expires_at_60_days(self):
        """Overlay paused for 61 days -> EXPIRED."""

class TestDataEdgeCases:
    def test_no_shared_domains_shows_complement(self):
        """Zero domain overlap still computes complement."""

    def test_all_brightness_0_5_no_interactions(self):
        """Dead zone produces zero interactions, explains why."""

    def test_1_star_vs_30_stars_low_confidence(self):
        """Asymmetric size penalizes confidence."""

class TestFormulaBoundaries:
    def test_brightness_zero_no_division_error(self):
        """brightness=0 handled gracefully."""

    def test_brightness_one_max_strength(self):
        """brightness=1.0 produces maximum strength."""

    def test_both_blurred_minimum_certainty(self):
        """Both blurred -> certainty = 0.5."""

class TestAbusePrevention:
    def test_sybil_detection_blocks_fake_account(self):
        """Fake account patterns blocked from invites."""

    def test_repeated_decline_triggers_permanent_block(self):
        """3 declines = permanent block."""

    def test_stalking_pattern_flagged(self):
        """Repeated invites at cooldown end flagged."""
```

---

*SKIN complete. Edge cases identified, mitigations specified, test scenarios outlined. Proceed to SWEAT for implementation guidance.*
