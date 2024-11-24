import express from "express";
import puppeteer from "puppeteer-core";
import chromium from "@sparticuz/chromium";

const router = express.Router();

router.get("/", async (req, res) => {
  let browser;
  try {
    browser = await puppeteer.launch({
      headless: chromium.headless,
      executablePath: await chromium.executablePath(),
      args: [
        ...chromium.args,
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-gpu",
        "--disable-software-rasterizer",
      ],
    });

    const page = await browser.newPage();
    
    await page.goto("https://pokemonkorea.co.kr/news", { waitUntil: "domcontentloaded", timeout: 60000 });

    await page.waitForSelector("#newslist li");

    const eventData = [];
    const eventList = await page.$$("#newslist li");

    for (const element of eventList) {
      const linkElement = await element.$("a");

      if (linkElement) {
        const link = await (await linkElement.getProperty("href")).jsonValue();
        const title = await (
          await element.$(".bx-txt h3")
        ).evaluate((node) => node.textContent.trim());
        const sprite = await (
          await element.$(".list-split li:first-child")
        ).evaluate((node) => node.textContent.trim());
        const date = await (
          await element.$(".list-split li:last-child")
        ).evaluate((node) => node.textContent.trim());

        const imageUrlElement = await element.$(".tumb-wrp img");
        const imageUrl = imageUrlElement
          ? await (await imageUrlElement.getProperty("src")).jsonValue()
          : null;

        eventData.push({ link, title, sprite, date, imageUrl });
      }
    }

    res.status(200).json(eventData);
  } catch (error) {
    console.error("웹 스크래핑 에러:", error);
    res.status(500).json({ error: error.message });
  } finally {
    if (browser) {
      await browser.close();
    }
  }
});

export default router;
