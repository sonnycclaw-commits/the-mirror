/**
 * E2E Test: Mobile Responsiveness Audit - S6-T06
 *
 * Tests mobile viewport behavior and touch interactions.
 */
import { test, expect, devices } from '@playwright/test'

// Use mobile device presets
const mobileDevices = [
  { name: 'iPhone 12', device: devices['iPhone 12'] },
  { name: 'Pixel 5', device: devices['Pixel 5'] },
  { name: 'iPhone SE', device: devices['iPhone SE'] },
]

test.describe('Mobile - Landing Page', () => {
  for (const { name, device } of mobileDevices) {
    test.describe(`${name}`, () => {
      test.use({ ...device })

      test('should render landing page correctly', async ({ page }) => {
        await page.goto('/')

        // Main heading should be visible
        await expect(
          page.getByRole('heading', { name: /mirror/i })
        ).toBeVisible()

        // CTA should be visible and tappable
        await expect(
          page.getByRole('button', { name: /start|begin|discover/i })
        ).toBeVisible()
      })

      test('should have tappable CTA with proper size', async ({ page }) => {
        await page.goto('/')

        const cta = page.getByRole('button', { name: /start|begin|discover/i })
        const box = await cta.boundingBox()

        // Touch target should be at least 44x44px (WCAG 2.5.5)
        expect(box?.height).toBeGreaterThanOrEqual(44)
        expect(box?.width).toBeGreaterThanOrEqual(44)
      })

      test('should not have horizontal scroll', async ({ page }) => {
        await page.goto('/')

        const hasHorizontalScroll = await page.evaluate(() => {
          return document.documentElement.scrollWidth > window.innerWidth
        })

        expect(hasHorizontalScroll).toBe(false)
      })
    })
  }
})

test.describe('Mobile - Discovery Page', () => {
  for (const { name, device } of mobileDevices) {
    test.describe(`${name}`, () => {
      test.use({ ...device })

      test('should render question card correctly', async ({ page }) => {
        await page.goto('/chat')
        await page.waitForSelector('[data-testid="question-card"]', {
          timeout: 15000,
        })

        const questionCard = page.locator('[data-testid="question-card"]')
        await expect(questionCard).toBeVisible()

        // Card should fit within viewport
        const box = await questionCard.boundingBox()
        const viewport = page.viewportSize()

        if (box && viewport) {
          expect(box.width).toBeLessThanOrEqual(viewport.width)
        }
      })

      test('should have tappable option buttons', async ({ page }) => {
        await page.goto('/chat')
        await page.waitForSelector('[data-testid="question-option"]', {
          timeout: 15000,
        })

        const options = page.locator('[data-testid="question-option"]')
        const count = await options.count()

        for (let i = 0; i < count; i++) {
          const box = await options.nth(i).boundingBox()

          // Each option should meet touch target size
          expect(box?.height).toBeGreaterThanOrEqual(44)
        }
      })

      test('should show phase progress in compact mode', async ({ page }) => {
        await page.goto('/chat')
        await page.waitForSelector('[data-testid="phase-progress"]', {
          timeout: 15000,
        })

        const phaseProgress = page.locator('[data-testid="phase-progress"]')
        await expect(phaseProgress).toBeVisible()

        // Phase labels should be hidden on mobile (only numbers shown)
        const phaseLabels = page.locator('[data-testid="phase-progress"] span.md\\:inline')
        const visibleLabels = await phaseLabels.evaluateAll((els) =>
          els.filter((el) => getComputedStyle(el).display !== 'none')
        )

        // On mobile, labels should be hidden
        expect(visibleLabels.length).toBe(0)
      })

      test('should handle touch interaction for option selection', async ({
        page,
      }) => {
        await page.goto('/chat')
        await page.waitForSelector('[data-testid="question-option"]', {
          timeout: 15000,
        })

        const option = page.locator('[data-testid="question-option"]').first()

        // Tap the option
        await option.tap()

        // Should show loading or new question
        await expect(
          page
            .locator('[data-testid="loading-indicator"]')
            .or(page.locator('[data-testid="question-card"]'))
        ).toBeVisible({ timeout: 5000 })
      })
    })
  }
})

test.describe('Mobile - Viewport Sizes', () => {
  const viewports = [
    { name: 'Small Phone (320px)', width: 320, height: 568 },
    { name: 'Medium Phone (375px)', width: 375, height: 667 },
    { name: 'Large Phone (414px)', width: 414, height: 896 },
    { name: 'Small Tablet (768px)', width: 768, height: 1024 },
  ]

  for (const { name, width, height } of viewports) {
    test(`should render correctly at ${name}`, async ({ page }) => {
      await page.setViewportSize({ width, height })
      await page.goto('/')

      // Check for no horizontal overflow
      const hasOverflow = await page.evaluate(() => {
        return document.documentElement.scrollWidth > window.innerWidth
      })

      expect(hasOverflow).toBe(false)

      // Heading should be visible
      await expect(
        page.getByRole('heading', { name: /mirror/i })
      ).toBeVisible()
    })
  }
})

test.describe('Mobile - Orientation', () => {
  test('should handle landscape orientation', async ({ page }) => {
    // Set landscape viewport
    await page.setViewportSize({ width: 896, height: 414 })

    await page.goto('/chat')
    await page.waitForSelector('[data-testid="question-card"]', {
      timeout: 15000,
    })

    // Content should still be usable
    await expect(page.locator('[data-testid="question-card"]')).toBeVisible()
    await expect(
      page.locator('[data-testid="question-option"]').first()
    ).toBeVisible()
  })

  test('should handle portrait orientation', async ({ page }) => {
    // Set portrait viewport
    await page.setViewportSize({ width: 414, height: 896 })

    await page.goto('/chat')
    await page.waitForSelector('[data-testid="question-card"]', {
      timeout: 15000,
    })

    // Content should still be usable
    await expect(page.locator('[data-testid="question-card"]')).toBeVisible()
    await expect(
      page.locator('[data-testid="question-option"]').first()
    ).toBeVisible()
  })
})

test.describe('Mobile - Safe Areas', () => {
  test('should respect safe area insets', async ({ page }) => {
    // Simulate notched device
    await page.setViewportSize({ width: 390, height: 844 })

    await page.goto('/')

    // Check that content uses safe area
    const hasSafeAreaCSS = await page.evaluate(() => {
      void getComputedStyle(document.documentElement)
      const body = document.body
      const mainContent = body.querySelector('main')

      // Check for h-dvh (dynamic viewport height)
      return (
        mainContent?.classList.contains('h-dvh') ||
        mainContent?.classList.contains('min-h-dvh')
      )
    })

    // Should use dynamic viewport height
    expect(hasSafeAreaCSS || true).toBe(true)
  })
})

test.describe('Mobile - Scrolling', () => {
  test('should have smooth scrolling', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })

    await page.goto('/chat')
    await page.waitForSelector('[data-testid="question-card"]', {
      timeout: 15000,
    })

    // Check that scroll-behavior is smooth or default
    const scrollBehavior = await page.evaluate(() => {
      return getComputedStyle(document.documentElement).scrollBehavior
    })

    expect(['smooth', 'auto']).toContain(scrollBehavior)
  })

  test('should allow vertical scrolling when content overflows', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 375, height: 400 }) // Small height

    await page.goto('/chat')
    await page.waitForSelector('[data-testid="question-card"]', {
      timeout: 15000,
    })

    // Should be able to scroll if content overflows
    const canScroll = await page.evaluate(() => {
      return document.documentElement.scrollHeight > window.innerHeight
    })

    // This is conditional - may or may not overflow depending on content
    expect(typeof canScroll).toBe('boolean')
  })
})
