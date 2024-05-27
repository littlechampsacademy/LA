const puppeteer = require("puppeteer");
require("dotenv").config();

const v1 = process.env.v1;
const v2 = process.env.v2;
const v3 = process.env.v3;
const v4 = process.env.v4;
const v5 = process.env.v5;

(async () => {
  try {
    const browser = await puppeteer.launch({
      headless: true,
      defaultViewport: false,
    });

    let url = v1;

    console.log("url set");

    const context = browser.defaultBrowserContext();
    await context.overridePermissions(v1, ["geolocation"]);

    console.log("location permission given");

    const page = await browser.newPage();

    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/93.0.4577.82 Safari/537.36"
    );
    console.log("useragent set");

    await page.setGeolocation({
      latitude: parseFloat(v4),
      longitude: parseFloat(v5),
    });

    console.log("location set");

    await page.goto(url, { timeout: 0, waitUntil: "load" });
    console.log("page opened");

    await page.type("#input-25", v2, { delay: 100 });
    await page.type("#password", v3, { delay: 100 });

    console.log("email pass set");

    await page.click(
      "#core-view > div.container.container--fluid > div:nth-child(2) > div > div > div > button"
    );
    console.log("login clicked");

    // await page.waitForNavigation();
    // console.log("waitForNavigation");

    await Promise.race([
      page.waitForSelector("#DASHBOARD_CLOCK_IN_BTN"),
      page.waitForSelector("#DASHBOARD_CLOCK_OUT_BTN"),
    ]);

    console.log("btn found");

    const button1 = await page.$("#DASHBOARD_CLOCK_IN_BTN");

    if (button1) {
      console.log("CLOCK_IN_BTN found");
      await page.click("#DASHBOARD_CLOCK_IN_BTN");
    } else {
      console.log("CLOCK_OUT_BTN found");
      await page.click("#DASHBOARD_CLOCK_OUT_BTN");
    }

    await browser.close();
  } catch (error) {
    console.log("something went wrong ", error);
  }
})();
