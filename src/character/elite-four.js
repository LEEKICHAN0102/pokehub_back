import express from "express";
import mongoose from "mongoose";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const eliteFour = await mongoose.connection
      .collection("elite-four")
      .find()
      .sort({ order: 1 })
      .toArray();
    res.json(eliteFour);
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