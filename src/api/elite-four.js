import express from "express";
import mongoose from "mongoose";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const eliteFour = await mongoose.connection.collection("elite-four").find();

    // 원하는 문서의 _id
    const documentId = "65a60183b3a30685a7670ef2";

    // 원하는 문서를 찾습니다.
    const targetDocumentIndex = eliteFour.findIndex(doc => doc._id.toString() === documentId);

    // 찾은 문서가 없으면 오류를 반환합니다.
    if (targetDocumentIndex === -1) {
      return res.status(404).json({ message: "문서를 찾을 수 없습니다." });
    }

    // 12번째 위치에 있는 문서의 인덱스
    const targetIndex = 11;

    // 옮기려는 문서
    const targetDocument = eliteFour.splice(targetDocumentIndex, 1)[0];

    // 12번째 위치에 문서를 삽입합니다.
    eliteFour.splice(targetIndex, 0, targetDocument);
    res.json( eliteFour );
  } catch (error) {
    console.error("에러 발생:", error);
    res.status(500).send("서버 에러");
  }
});


router.get("/detail/:order", async (req, res) => {
  try {
    const { order } = req.params;
    const findByEliteName = await mongoose.connection.collection("elite-four").findOne({ order: Number(order) });
    res.json(findByEliteName);
  } catch (error) {
    console.error("에러 발생:", error);
    res.status(500).send("서버 에러");
  }
});

export default router;