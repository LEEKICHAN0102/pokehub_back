import express from "express";
import * as cheerio from "cheerio";
import puppeteer from "puppeteer";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    // Puppeteer를 사용하여 브라우저를 실행
    const browser = await puppeteer.launch({ headless: "true" });
    const page = await browser.newPage();

    // 해당 URL로 이동
    await page.goto("https://pokemonkorea.co.kr/news", { waitUntil: "domcontentloaded" });

    // Puppeteer의 waitForSelector를 사용하여 페이지가 완전히 로드될 때까지 대기
    await page.waitForSelector("#newslist li");

    // 페이지의 HTML을 가져오기
    const htmlString = await page.content();

    // Cheerio를 사용하여 HTML을 파싱
    const $ = cheerio.load(htmlString);

    const eventData = [];

    // 각 li 요소를 반복하며 정보 추출
    $("#newslist li").each((index, element) => {
      const title = $(element).find(".bx-txt h3").text().trim();
      const date = $(element).find(".list-split li:last-child").text().trim();
      // 이미지 URL을 가져오기 전에 해당 요소가 존재하는지 확인
      const imageUrlElement = $(element).find(".tumb-wrp img");
const imageUrl = imageUrlElement.length ? imageUrlElement.attr("src").trim() : null;

      eventData.push({ title, date, imageUrl });
    });

    console.log(`Number of elements: ${$("#newslist li").length}`);
    console.log(eventData);

    // 브라우저 종료
    await browser.close();

    res.status(200).json(eventData);
  } catch (error) {
    console.error("웹 스크래핑 에러:", error);
    res.status(404).json({ error: error.message });
  }
});

export default router;
