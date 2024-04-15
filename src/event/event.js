import express from "express";
import puppeteer from "puppeteer";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const browser = await puppeteer.launch({ 
      headless: "new",
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
    const page = await browser.newPage();

    // 해당 URL로 이동
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
        // 이미지 URL을 가져오기 전에 해당 요소가 존재하는지 확인
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
