import asyncio
from playwright.async_api import async_playwright

async def run():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page()
        await page.goto("http://localhost:3000")

        # Login as Super User
        await page.get_by_role("link", name="Sign In").click()
        await page.get_by_label("Email").fill("admin@toylibrary.com")
        await page.get_by_label("Password").fill("admin123")
        await page.get_by_role("button", name="Sign In").click()

        # Wait for Super User Dashboard
        await page.wait_for_selector("text=System Overview")
        await page.screenshot(path="/home/jules/verification/superuser_dashboard.png")

        # Go to Future Requirements
        await page.get_by_role("link", name="Future Requirements").click()
        await page.wait_for_selector("text=Database Migration")
        await page.screenshot(path="/home/jules/verification/future_requirements.png")

        print("Super User navigation verified")
        await browser.close()

asyncio.run(run())
