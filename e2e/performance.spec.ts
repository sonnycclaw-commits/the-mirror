/**
 * E2E Test: Performance Audit - S6-T04
 *
 * Tests performance metrics using web-vitals and basic timing.
 */
import { test, expect } from '@playwright/test'

test.describe('Performance Audit', () => {
  test('should load landing page within acceptable time', async ({ page }) => {
    const startTime = Date.now()

    await page.goto('/')
    await page.waitForLoadState('domcontentloaded')

    const loadTime = Date.now() - startTime

    // Landing page should load in under 3 seconds
    expect(loadTime).toBeLessThan(3000)
  })

  test('should load discovery page within acceptable time', async ({ page }) => {
    const startTime = Date.now()

    await page.goto('/chat')
    await page.waitForSelector('[data-testid="question-card"]', { timeout: 15000 })

    const loadTime = Date.now() - startTime

    // Discovery page with initial question should load in under 10 seconds
    // (includes AI response time)
    expect(loadTime).toBeLessThan(10000)
  })

  test('should have no major layout shifts', async ({ page }) => {
    // Inject CLS measurement
    await page.goto('/')

    const cls = await page.evaluate(() => {
      return new Promise<number>((resolve) => {
        let clsValue = 0

        const observer = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            // @ts-expect-error - LayoutShift type
            if (!entry.hadRecentInput) {
              // @ts-expect-error - LayoutShift type
              clsValue += entry.value
            }
          }
        })

        observer.observe({ type: 'layout-shift', buffered: true })

        // Wait a bit for any shifts
        setTimeout(() => {
          observer.disconnect()
          resolve(clsValue)
        }, 2000)
      })
    })

    // CLS should be under 0.1 (good), 0.25 (needs improvement)
    expect(cls).toBeLessThan(0.25)
  })

  test('should have acceptable First Contentful Paint', async ({ page }) => {
    await page.goto('/')

    const fcp = await page.evaluate(() => {
      return new Promise<number>((resolve) => {
        const observer = new PerformanceObserver((list) => {
          const entries = list.getEntries()
          const fcpEntry = entries.find(
            (entry) => entry.name === 'first-contentful-paint'
          )
          if (fcpEntry) {
            resolve(fcpEntry.startTime)
          }
        })

        observer.observe({ type: 'paint', buffered: true })

        // Fallback if FCP not found
        setTimeout(() => resolve(3000), 5000)
      })
    })

    // FCP should be under 1.8s (good), 3s (needs improvement)
    expect(fcp).toBeLessThan(3000)
  })

  test('should not have excessive bundle size', async ({ page }) => {
    const resourceSizes: { url: string; size: number }[] = []

    page.on('response', async (response) => {
      const url = response.url()
      if (url.includes('.js') || url.includes('.css')) {
        try {
          const buffer = await response.body()
          resourceSizes.push({ url, size: buffer.length })
        } catch {
          // Ignore failed responses
        }
      }
    })

    await page.goto('/')
    await page.waitForLoadState('networkidle')

    const totalJSSize = resourceSizes
      .filter((r) => r.url.includes('.js'))
      .reduce((sum, r) => sum + r.size, 0)

    const totalCSSSize = resourceSizes
      .filter((r) => r.url.includes('.css'))
      .reduce((sum, r) => sum + r.size, 0)

    // JS bundle should be under 500KB uncompressed
    expect(totalJSSize).toBeLessThan(500 * 1024)

    // CSS should be under 100KB uncompressed
    expect(totalCSSSize).toBeLessThan(100 * 1024)
  })
})

test.describe('Interaction Performance', () => {
  test('should respond to option click within acceptable time', async ({
    page,
  }) => {
    await page.goto('/chat')
    await page.waitForSelector('[data-testid="question-option"]', {
      timeout: 15000,
    })

    const startTime = Date.now()

    // Click option
    await page.locator('[data-testid="question-option"]').first().click()

    // Wait for either loading indicator or new question
    await expect(
      page
        .locator('[data-testid="loading-indicator"]')
        .or(page.locator('[data-testid="question-card"]'))
    ).toBeVisible({ timeout: 5000 })

    const responseTime = Date.now() - startTime

    // UI should respond within 1 second (user perception threshold)
    expect(responseTime).toBeLessThan(1000)
  })
})
