const puppeteer = require("puppeteer");
require("dotenv").config();

const v1 = process.env.v1;
const v2 = process.env.v2;
const v3 = process.env.v3;
const v4 = process.env.v4;
const v5 = process.env.v5;

// Validate environment variables
if (!v1 || !v2 || !v3 || !v4 || !v5) {
  console.error("Missing required environment variables");
  process.exit(1);
}

console.log("v1 length is", v1.length);
console.log("v2 length is", v2.length);
console.log("v3 length is", v3.length);
console.log("v4 length is", v4.length);
console.log("v5 length is", v5.length);

(async () => {
  let browser;
  try {
    browser = await puppeteer.launch({
      headless: true,
      defaultViewport: false,
    });

    const url = v1;
    console.log("URL set");

    const context = browser.defaultBrowserContext();
    await context.overridePermissions(v1, ["geolocation"]);
    console.log("Location permission given");

    const page = await browser.newPage();
    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/93.0.4577.82 Safari/537.36"
    );
    console.log("User agent set");

    await page.setGeolocation({
      latitude: parseFloat(v4),
      longitude: parseFloat(v5),
    });
    console.log("Location set");

    await page.goto(url, { timeout: 60000, waitUntil: "networkidle0" });
    console.log("Page opened");

    await page.type("#input-25", v2, { delay: 100 });
    await page.type("#password", v3, { delay: 100 });
    console.log("Email and password set");

    await page.click(
      "#core-view > div.container.container--fluid > div:nth-child(2) > div > div > div > button"
    );
    console.log("Login clicked");

    await page.waitForNavigation({ timeout: 60000 });
    console.log("Navigation completed");

    await page.waitForNetworkIdle({ idleTime: 5000, timeout: 60000 });

    const btnSelector = await Promise.race([
      page.waitForSelector("#DASHBOARD_CLOCK_IN_BTN", { timeout: 10000 }),
      page.waitForSelector("#DASHBOARD_CLOCK_OUT_BTN", { timeout: 10000 }),
    ]);

    if (btnSelector) {
      console.log("Button found");
      await btnSelector.click();
    } else {
      throw new Error("Clock in/out button not found");
    }

    console.log("Closing browser");
  } catch (error) {
    console.error("An error occurred:", error);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
})();
