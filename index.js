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
            headless: false,
            defaultViewport: false,
        });

        let url = v1;

        const context = browser.defaultBrowserContext();
        await context.overridePermissions(v1, ["geolocation"]);

        const page = await browser.newPage();

        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/93.0.4577.82 Safari/537.36');

        await page.setGeolocation({
            latitude: parseFloat(v4),
            longitude: parseFloat(v5),
        });

        await page.goto(url, { waitUntil: "load" });

        await page.type("#input-25", v2, { delay: 100 });
        await page.type("#password", v3, { delay: 100 });
        await page.click(
            "#core-view > div.container.container--fluid > div:nth-child(2) > div > div > div > button"
        );

        await page.waitForNavigation();

        const clickInOut = await Promise.race([
            page.waitForSelector("#DASHBOARD_CLOCK_IN_BTN"),
            page.waitForSelector("#DASHBOARD_CLOCK_OUT_BTN"),
        ]);

        const button1 = await page.$("#DASHBOARD_CLOCK_IN_BTN");

        if (button1) {
            await page.click("#DASHBOARD_CLOCK_IN_BTN");
        } else {
            await page.click("#DASHBOARD_CLOCK_OUT_BTN");
        }



        // await browser.close()
    } catch (error) {
        console.log("something went wrong ", error);
    }
})();
