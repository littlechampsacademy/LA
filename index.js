const puppeteer = require("puppeteer");
require("dotenv").config();

const v1 = process.env.v1;
const v2 = process.env.v2;
const v3 = process.env.v3;
const v4 = process.env.v4;
const v5 = process.env.v5;

// Validate environment variables
const envVars = { v1, v2, v3, v4, v5 };
Object.entries(envVars).forEach(([key, value]) => {
    if (value) {
        console.log(`${key} length is`, value.length);
    } else {
        console.error(`Value for ${key} is not present`);
    }
});

(async () => {
    try {
        const browser = await puppeteer.launch({
            headless: true,
            defaultViewport: null,
        });

        const context = browser.defaultBrowserContext();
        await context.overridePermissions(v1, ["geolocation"]);

        const page = await browser.newPage();
        await page.setUserAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/93.0.4577.82 Safari/537.36");
        await page.setGeolocation({ latitude: parseFloat(v4), longitude: parseFloat(v5) });

        await page.goto(v1, { waitUntil: "networkidle2" });
        await page.type("#input-25", v2, { delay: 100 });
        await page.type("#password", v3, { delay: 100 });
        await page.click("#core-view > div.container.container--fluid > div:nth-child(2) > div > div > div > button");
        await page.waitForNavigation({ waitUntil: "networkidle2" });

        // Use a longer timeout period and wait for network to be idle
        const buttonSelector = await page.waitForSelector(
            "#DASHBOARD_CLOCK_IN_BTN, #DASHBOARD_CLOCK_OUT_BTN",
            { timeout: 60000 } // Extend timeout to 60 seconds
        );

        const buttonId = await page.evaluate(() => {
            const clockInBtn = document.querySelector("#DASHBOARD_CLOCK_IN_BTN");
            const clockOutBtn = document.querySelector("#DASHBOARD_CLOCK_OUT_BTN");
            if (clockInBtn) return clockInBtn.id;
            if (clockOutBtn) return clockOutBtn.id;
            return null;
        });

        if (buttonId) {
            await page.click(`#${buttonId}`);
            console.log(`${buttonId} clicked`);
        } else {
            console.error('Neither CLOCK_IN_BTN nor CLOCK_OUT_BTN found');
        }

        await browser.close();
        console.log('Browser closed');
    } catch (error) {
        console.error("Something went wrong", error);
    }
})();
