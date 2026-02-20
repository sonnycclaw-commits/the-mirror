# Implementation Report: DECISION-001 Convex Profiles Schema Update
Generated: 2026-01-18

## Task
Update Convex profiles table and mutations to store the PsychometricProfile structure with validated psychological constructs per DECISION-001.

## Summary

Successfully updated the Convex profiles schema and mutations to support the enhanced psychometric profile structure. The implementation adds support for:

- **Schwartz Values** - Primary and secondary value arrays
- **SDT Needs** (Self-Determination Theory) - Autonomy, competence, relatedness with state/intensity
- **McClelland's Dominant Motive** - Achievement, power, or affiliation
- **Vaillant's Defense Hierarchy** - Primary defenses and maturity level
- **Attachment Markers** - Style, confidence, and evidence
- **Kegan's Developmental Stages** - Stage, state, and evidence

## Changes Made

### 1. `/Users/joelchan/Documents/Coding/App-Dev/live/unfuck-your-life/the-mirror/convex/schema.ts`

Updated the `profiles` table definition to include:

```typescript
// Schwartz Values (validated construct)
values: v.object({
  primary: v.array(v.string()),
  secondary: v.optional(v.array(v.string())),
}),

// SDT Needs Assessment
needs: v.object({
  autonomy: v.object({
    state: v.union(v.literal('SATISFIED'), v.literal('FRUSTRATED')),
    intensity: v.number(),
    evidence: v.optional(v.string()),
  }),
  // ... competence, relatedness
}),

// McClelland's Dominant Motive
dominantMotive: v.object({
  type: v.union(v.literal('ACHIEVEMENT'), v.literal('POWER'), v.literal('AFFILIATION')),
  evidence: v.array(v.string()),
}),

// Vaillant's Defense Hierarchy
defenses: v.object({
  primary: v.array(v.string()),
  maturityLevel: v.union(v.literal('IMMATURE'), v.literal('NEUROTIC'), v.literal('MATURE')),
}),

// Attachment Markers
attachmentMarkers: v.object({
  style: v.union(v.literal('SECURE'), v.literal('ANXIOUS'), v.literal('AVOIDANT'), v.literal('DISORGANIZED')),
  confidence: v.number(),
  evidence: v.array(v.string()),
}),

// Kegan's Developmental Stages
development: v.object({
  stage: v.union(v.literal('SOCIALIZED'), v.literal('SELF_AUTHORING'), v.literal('SELF_TRANSFORMING')),
  state: v.union(v.literal('STABLE'), v.literal('TRANSITIONING')),
  evidence: v.array(v.string()),
}),
```

Legacy fields (`primaryFears`, `coreValues`, `needsAssessment`) made optional for backward compatibility.

### 2. `/Users/joelchan/Documents/Coding/App-Dev/live/unfuck-your-life/the-mirror/convex/profiles.ts`

- **Updated `save` mutation** - Now accepts the full psychometric profile structure
- **Added `saveLegacy` mutation** - Backward compatible mutation that converts legacy format to new structure with sensible defaults
- **Added `update` mutation** - For partial profile updates
- **Added typed validators** for each construct (valuesValidator, needsValidator, etc.)

### 3. `/Users/joelchan/Documents/Coding/App-Dev/live/unfuck-your-life/the-mirror/convex/discovery.ts`

- Updated to use `profiles.saveLegacy` instead of `profiles.save` for backward compatibility
- Added comment noting migration path

## Test Results

- TypeScript type checking: PASSED (no profiles-related errors)
- Schema validation: Compatible with Convex validators
- Backward compatibility: Maintained via `saveLegacy` mutation

## Migration Path

1. Current state: `discovery.ts` uses `saveLegacy` which auto-converts legacy profiles
2. Next step: Update `synthesize-profile.ts` AI tool schema to output new format
3. Final: Switch `discovery.ts` to use `profiles.save` directly

## Files Modified

| File | Change |
|------|--------|
| `convex/schema.ts` | Added 6 new psychometric construct fields to profiles table |
| `convex/profiles.ts` | Updated validators, added `saveLegacy`, added `update` mutation |
| `convex/discovery.ts` | Changed to use `saveLegacy` for backward compatibility |

## Notes

- The project has pre-existing TypeScript errors unrelated to this change
- The `synthesize-profile.ts` AI tool still uses the legacy schema - this will need a separate update
- The `saveLegacy` mutation provides sensible defaults for new constructs (e.g., maturityLevel: 'NEUROTIC', stage: 'SELF_AUTHORING') which are marked as "needs validation"
