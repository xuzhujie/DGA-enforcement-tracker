import { expect, test } from '@playwright/test'

test('dashboard exposes the DGA definition and separates DMA/DSA', async ({ page }) => {
  await page.goto('/')
  await expect(page).toHaveTitle('DGA 执法追踪器')
  await expect(page.getByRole('heading', { name: 'DGA 是什么？' })).toBeVisible()
  await expect(page.getByText('不是 DMA/DSA 式的大型平台或内容治理法规。')).toBeVisible()
  await expect(page.locator('.stat-card').filter({ hasText: '有 formal notice 的成员国事项' }).locator('.stat-value')).toHaveText('19')
})

test('governance and Article 31 tracks remain visible and narrow-safe', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('button', { name: '治理基础设施' }).click()
  await expect(page.getByRole('heading', { name: 'DGA 治理基础设施' })).toBeVisible()
  await expect(page.getByText('成员国 DGA 主管机关')).toBeVisible()
  await expect(page.getByText('已获认可的数据利他组织')).toBeVisible()

  await page.getByRole('button', { name: '非个人数据出境' }).click()
  await expect(page.getByText('当前 reviewed source set 没有可核验的 Article 31 个案记录。')).toBeVisible()
  await expect(page.locator('.transfer-status .status-tag')).toHaveText('未定位到')

  const hasDocumentOverflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1)
  expect(hasDocumentOverflow).toBe(false)
})
