# Pre-Mortem Protocol (Risk Analysis)

> **Purpose**: Identify failure modes before they occur.
> **Core Concept**: "Imagine it's 3 months from now and this project has failed. Why?"

---

## Risk Categories (Shreyas Framework)
| Symbol | Meaning | Action |
|--------|---------|--------|
| **[TIGER]** | Clear threat | **BLOCKING**. Must mitigate or accept. |
| **[PAPER]** | Looks scary, actually fine | mitigation exists (verify). |
| **[ELEPHANT]** | Unspoken concern | Discuss openly. |

## Verification Checklist (The "Tiger Check")
Before flagging a Tiger:
1.  **Context**: Read ±20 lines?
2.  **Fallback**: Is there a try/catch or default?
3.  **Scope**: Is this in scope?

## Workflow

### 1. Detect & Assess
*   **Quick**: For Plans/PRs. (Mental scan).
*   **Deep**: Before Implementation. (Systematic Category Scan).

### 2. Categories to Scan
*   **Tech**: Scalability, Dependencies, Data, Security.
*   **Integration**: Breaking changes, Rollback.
*   **Process**: Requirements clarity, Debt.
*   **Testing**: Coverage gaps.

### 3. Mitigation Strategy
*   **Accept**: Acknowledge risk.
*   **Mitigate**: Add specific engineering fix (e.g., Circuit Breaker).
*   **Research**: Spawn agent to find best practice.

## Integration in Logic
*   The "Decomposition Agent" can use this during **Phase 5 (Completeness)** to stress-test the Life Plan.
    *   "Imagine you failed this month. Was it because you didn't have time (Tiger) or because you were afraid (Elephant)?"
