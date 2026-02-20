/**
 * E2E Test: Full Discovery Flow - S6-T01
 *
 * Tests the complete discovery journey from landing to contract.
 * Uses Playwright for browser automation.
 *
 * Test flow:
 * 1. Load landing page
 * 2. Start discovery session
 * 3. Select scenario
 * 4. Answer follow-up questions (EXCAVATION)
 * 5. Confirm synthesis
 * 6. Sign contract
 */
import { test, expect } from '@playwright/test'

test.describe('Discovery Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the app
    await page.goto('/')
  })

  test('should display landing page with CTA', async ({ page }) => {
    // Check landing page elements
    await expect(page.getByRole('heading', { name: /mirror/i })).toBeVisible()
    await expect(page.getByRole('button', { name: /start|begin|discover/i })).toBeVisible()
  })

  test('should start discovery session on CTA click', async ({ page }) => {
    // Click CTA
    await page.getByRole('button', { name: /start|begin|discover/i }).click()

    // Should navigate to discovery route
    await expect(page).toHaveURL(/\/chat/)

    // Should show phase indicator
    await expect(page.getByText(/scenario/i)).toBeVisible()
  })

  test('should display scenario selection cards', async ({ page }) => {
    // Navigate to discovery
    await page.goto('/chat')

    // Wait for scenario cards to load
    await expect(page.locator('[data-testid="question-card"]')).toBeVisible({
      timeout: 10000,
    })

    // Should have multiple options
    const options = page.locator('[data-testid="question-option"]')
    const count = await options.count()
    expect(count).toBeGreaterThanOrEqual(2)
  })

  test('should progress through EXCAVATION phase', async ({ page }) => {
    // Start discovery
    await page.goto('/chat')

    // Select first scenario
    await page.locator('[data-testid="question-option"]').first().click()

    // Wait for follow-up question
    await expect(page.locator('[data-testid="question-card"]')).toBeVisible({
      timeout: 10000,
    })

    // Answer follow-up (select an option)
    await page.locator('[data-testid="question-option"]').first().click()

    // Phase should eventually change to EXCAVATION or show more questions
    await expect(
      page.getByText(/excavation|reflection|synthesis/i)
    ).toBeVisible({ timeout: 30000 })
  })

  test('should display contract after completing discovery', async ({ page }) => {
    // This is a full flow test - may take longer
    test.slow()

    await page.goto('/chat')

    // Complete the flow by clicking through options
    for (let i = 0; i < 10; i++) {
      // Wait for question card
      const questionCard = page.locator('[data-testid="question-card"]')
      if (!(await questionCard.isVisible({ timeout: 5000 }).catch(() => false))) {
        break
      }

      // Click first available option
      await page.locator('[data-testid="question-option"]').first().click()

      // Wait for processing
      await page.waitForTimeout(1000)
    }

    // Eventually should show contract or completion
    await expect(
      page.getByText(/contract|refusal|becoming|congratulations/i)
    ).toBeVisible({ timeout: 60000 })
  })
})

test.describe('Phase Progress', () => {
  test('should show correct phase indicator', async ({ page }) => {
    await page.goto('/chat')

    // Phase progress should be visible
    const phaseProgress = page.locator('[data-testid="phase-progress"]')
    await expect(phaseProgress).toBeVisible()

    // Should show 4 phases
    const phases = page.locator('[data-testid="phase-item"]')
    await expect(phases).toHaveCount(4)
  })

  test('should highlight current phase', async ({ page }) => {
    await page.goto('/chat')

    // Current phase should have active styling
    const activePhase = page.locator('[data-testid="phase-item"][data-active="true"]')
    await expect(activePhase).toBeVisible()
  })
})

test.describe('Error Handling', () => {
  test('should show error state on network failure', async ({ page }) => {
    // Simulate offline mode
    await page.route('**/api/**', (route) => route.abort())

    await page.goto('/chat')

    // Try to interact
    const option = page.locator('[data-testid="question-option"]').first()
    if (await option.isVisible()) {
      await option.click()
    }

    // Should show error message or fallback
    await expect(
      page.getByText(/error|retry|connection|offline/i)
    ).toBeVisible({ timeout: 10000 })
  })

  test('should allow retry after error', async ({ page }) => {
    await page.goto('/chat')

    // Look for retry button if error occurred
    const retryButton = page.getByRole('button', { name: /retry/i })
    if (await retryButton.isVisible().catch(() => false)) {
      await retryButton.click()

      // Should attempt to reload
      await expect(page.locator('[data-testid="question-card"]')).toBeVisible({
        timeout: 10000,
      })
    }
  })
})
