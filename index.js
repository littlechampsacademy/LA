const puppeteer = require("puppeteer");
require("dotenv").config();

(async () => {
  try {
    // Validate environment variables (assuming they're all required)
    if (!process.env.v1 || !process.env.v2 || !process.env.v3 || !process.env.v4 || !process.env.v5) {
      throw new Error("Missing required environment variables (v1-v5)");
    }

    const browser = await puppeteer.launch({ headless: true }); // Consider non-headless mode for debugging
    const page = await browser.newPage();

    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/93.0.4577.82 Safari/537.36"
    );

    const url = process.env.v1;

    await page.goto(url, { waitUntil: "networkidle2" }); // Wait for network requests to settle

    // Improved credential input with optional delay
    await page.type("#input-25", process.env.v2, { delay: process.env.EMAIL_TYPE_DELAY || 100 }); // Use EMAIL_TYPE_DELAY if needed
    await page.type("#password", process.env.v3, { delay: process.env.PASSWORD_TYPE_DELAY || 100 });

    // Consider more robust login click logic based on site structure
    await page.click("#core-view > div.container.container--fluid > div:nth-child(2) > div > div > div > button");

    await page.waitForNavigation({ waitUntil: "networkidle2" }); // Wait for navigation and network stability

    const btnSelector = await page.evaluate(() => {
      const clockInBtn = document.querySelector("#DASHBOARD_CLOCK_IN_BTN");
      if (clockInBtn) return "#DASHBOARD_CLOCK_IN_BTN";
      const clockOutBtn = document.querySelector("#DASHBOARD_CLOCK_OUT_BTN");
      return clockOutBtn ? "#DASHBOARD_CLOCK_OUT_BTN" : null; // Handle no buttons found
    });

    if (!btnSelector) {
      throw new Error("Neither clock in nor clock out button found");
    }

    await page.waitForSelector(btnSelector, { timeout: 10000 }); // Adjust timeout as needed

    await page.click(btnSelector);

    console.log("Clocked in/out successfully!");
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await browser.close();
  }
})();
