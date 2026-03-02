import { test, expect } from '@playwright/test'

// Smoke tests: verify the app loads and core ReactFlow canvas elements are present.
// These run against the dev server (npm run dev) and serve as a migration safety net:
// if the xyflow v12 swap breaks rendering, these will catch it immediately.

test.describe('smoke', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('page title is set', async ({ page }) => {
    await expect(page).toHaveTitle(/data.?map/i)
  })

  test('ReactFlow canvas is rendered', async ({ page }) => {
    // v11: .react-flow__renderer  v12: same class name (unchanged)
    await expect(page.locator('.react-flow__renderer')).toBeVisible()
  })

  test('at least one node is visible on the default project', async ({ page }) => {
    // GenericNode renders as .react-flow__node
    await expect(page.locator('.react-flow__node').first()).toBeVisible()
  })

  test('menubar is rendered', async ({ page }) => {
    await expect(page.locator('[role="menubar"]')).toBeVisible()
  })
})
