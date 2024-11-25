import express from "express";
import puppeteer from "puppeteer-core";
import chromium from "chrome-aws-lambda";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const browser = await puppeteer.launch({
      headless: true,
      executablePath: await chromium.executablePath,
      args: [
        ...chromium.args,
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-gpu',
        '--disable-software-rasterizer',
      ], // 용량이 좀 많아서 실패하는 거 같음.. Options 변경
      defaultViewport: chromium.defaultViewport,
    });

    const page = await browser.newPage();
    await page.goto("https://pokemonkorea.co.kr/news", { waitUntil: "domcontentloaded" });

    await page.waitForSelector("#newslist li");
    await page.waitForTimeout(2000);

    const eventData = [];
    const eventList = await page.$$("#newslist li");

    for (const element of eventList) {
      const linkElement = await element.$("a");

      if (linkElement) {
        const link = await (await linkElement.getProperty("href")).jsonValue();
        const title = await (await element.$(".bx-txt h3")).evaluate((node) => node.textContent.trim());
        const sprite = await (await element.$(".list-split li:first-child")).evaluate((node) => node.textContent.trim());
        const date = await (await element.$(".list-split li:last-child")).evaluate((node) => node.textContent.trim());
        
        const imageUrlElement = await element.$(".tumb-wrp img");
        const imageUrl = imageUrlElement ? await (await imageUrlElement.getProperty("src")).jsonValue() : null;

        eventData.push({ link, title, sprite, date, imageUrl });
      }
    }

    await browser.close();
    res.status(200).json(eventData);
  } catch (error) {
    console.error("웹 스크래핑 에러:", error);
    res.status(404).json({ error: error.message });
  }
});

export default router;
