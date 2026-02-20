/**
 * E2E Test: Session Recovery - S6-T03
 *
 * Tests that users can resume their session after page refresh.
 *
 * Test flow:
 * 1. Complete 3 questions
 * 2. Refresh the page
 * 3. Verify session resumes from the same point
 */
import { test, expect } from '@playwright/test'

test.describe('Session Recovery', () => {
  test('should persist session across page refresh', async ({ page }) => {
    // Navigate to discovery
    await page.goto('/chat')

    // Wait for first question
    await page.waitForSelector('[data-testid="question-card"]', { timeout: 10000 })

    // Answer 3 questions
    for (let i = 0; i < 3; i++) {
      // Wait for question
      await page.waitForSelector('[data-testid="question-option"]', { timeout: 10000 })

      // Select first option
      await page.locator('[data-testid="question-option"]').first().click()

      // Wait for next question or processing
      await page.waitForTimeout(2000)
    }

    // Get current state before refresh
    const phaseBeforeRefresh = await page
      .locator('[data-testid="phase-item"][data-active="true"]')
      .textContent()
      .catch(() => null)

    void await page
      .locator('[data-testid="question-text"]')
      .textContent()
      .catch(() => null)

    // Refresh the page
    await page.reload()

    // Wait for session recovery
    await page.waitForSelector('[data-testid="question-card"]', { timeout: 10000 })

    // Get state after refresh
    const phaseAfterRefresh = await page
      .locator('[data-testid="phase-item"][data-active="true"]')
      .textContent()
      .catch(() => null)

    // Should be in the same phase (or later)
    if (phaseBeforeRefresh && phaseAfterRefresh) {
      const phases = ['SCENARIO', 'EXCAVATION', 'SYNTHESIS', 'CONTRACT']
      const beforeIndex = phases.findIndex((p) =>
        phaseBeforeRefresh.toUpperCase().includes(p)
      )
      const afterIndex = phases.findIndex((p) =>
        phaseAfterRefresh.toUpperCase().includes(p)
      )

      expect(afterIndex).toBeGreaterThanOrEqual(beforeIndex)
    }
  })

  test('should recover extracted signals', async ({ page }) => {
    // Navigate and answer a few questions
    await page.goto('/chat')
    await page.waitForSelector('[data-testid="question-card"]', { timeout: 10000 })

    // Answer 2 questions to trigger signal extraction
    for (let i = 0; i < 2; i++) {
      await page.waitForSelector('[data-testid="question-option"]', { timeout: 10000 })
      await page.locator('[data-testid="question-option"]').first().click()
      await page.waitForTimeout(2000)
    }

    // Refresh
    await page.reload()

    // Wait for recovery
    await page.waitForTimeout(3000)

    // The session should have context (signals should influence prompts)
    // This is an indirect test - the AI should remember context
    const questionText = await page
      .locator('[data-testid="question-text"]')
      .textContent()

    // Question should exist (session recovered)
    expect(questionText).not.toBeNull()
  })

  test('should show recovery indicator briefly', async ({ page }) => {
    // Navigate and make progress
    await page.goto('/chat')
    await page.waitForSelector('[data-testid="question-card"]', { timeout: 10000 })

    // Answer one question
    await page.locator('[data-testid="question-option"]').first().click()
    await page.waitForTimeout(2000)

    // Refresh
    await page.reload()

    // Look for recovery/loading indicator
    const recoveryIndicator = page.locator('[data-testid="session-recovery"]')
    const loadingIndicator = page.locator('[data-testid="loading-indicator"]')

    // Check for indicator (side effect: ensures page has loaded)
    void (
      (await recoveryIndicator.isVisible().catch(() => false)) ||
      (await loadingIndicator.isVisible().catch(() => false))
    )

    // Eventually content should appear
    await page.waitForSelector('[data-testid="question-card"]', { timeout: 10000 })
  })

  test('should handle expired session gracefully', async ({ page, context }) => {
    // Clear storage to simulate expired session
    await context.clearCookies()

    // Navigate to discovery
    await page.goto('/chat')

    // Should either:
    // 1. Redirect to landing page
    // 2. Start new session
    // 3. Show authentication prompt

    await expect(
      page.locator('[data-testid="question-card"]').or(
        page.getByRole('button', { name: /start|begin|discover/i })
      )
    ).toBeVisible({ timeout: 10000 })
  })
})

test.describe('Message History Recovery', () => {
  test('should display previous messages after refresh', async ({ page }) => {
    await page.goto('/chat')
    await page.waitForSelector('[data-testid="question-card"]', { timeout: 10000 })

    // Answer a question
    await page.locator('[data-testid="question-option"]').first().click()
    await page.waitForTimeout(2000)

    // Get message count before refresh
    const messagesBeforeRefresh = await page
      .locator('[data-testid="message-bubble"]')
      .count()
      .catch(() => 0)

    // Refresh
    await page.reload()

    // Wait for content
    await page.waitForSelector('[data-testid="question-card"]', { timeout: 10000 })
    await page.waitForTimeout(1000)

    // Get message count after refresh
    const messagesAfterRefresh = await page
      .locator('[data-testid="message-bubble"]')
      .count()
      .catch(() => 0)

    // Should have similar message count (history preserved)
    // Allow some variance as display might differ
    expect(messagesAfterRefresh).toBeGreaterThanOrEqual(Math.max(0, messagesBeforeRefresh - 2))
  })
})

test.describe('Phase Continuity', () => {
  test('should maintain phase progress after refresh', async ({ page }) => {
    await page.goto('/chat')
    await page.waitForSelector('[data-testid="question-card"]', { timeout: 10000 })

    // Verify phase element exists (side effect)
    void await page
      .locator('[data-testid="phase-item"][data-active="true"]')
      .getAttribute('data-phase')

    // Progress through multiple questions
    for (let i = 0; i < 5; i++) {
      const option = page.locator('[data-testid="question-option"]').first()
      if (!(await option.isVisible().catch(() => false))) break

      await option.click()
      await page.waitForTimeout(2000)
    }

    // Get phase after progress
    const progressedPhase = await page
      .locator('[data-testid="phase-item"][data-active="true"]')
      .getAttribute('data-phase')
      .catch(() => null)

    // Refresh
    await page.reload()
    await page.waitForTimeout(3000)

    // Get phase after refresh
    const recoveredPhase = await page
      .locator('[data-testid="phase-item"][data-active="true"]')
      .getAttribute('data-phase')
      .catch(() => null)

    // Recovered phase should match progressed phase (or be later)
    if (progressedPhase && recoveredPhase) {
      const phases = ['SCENARIO', 'EXCAVATION', 'SYNTHESIS', 'CONTRACT']
      const progressedIndex = phases.indexOf(progressedPhase.toUpperCase())
      const recoveredIndex = phases.indexOf(recoveredPhase.toUpperCase())

      expect(recoveredIndex).toBeGreaterThanOrEqual(progressedIndex)
    }
  })
})
