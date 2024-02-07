import express from "express";
import mongoose from "mongoose";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const champions = await mongoose.connection.collection("champion").find().toArray();
    res.json(champions);
  } catch (error) {
    console.error("에러 발생:", error);
    res.status(500).send("서버 에러");
  }
});

router.get("/detail/:name", async (req, res) => {
  try {
    const { name } = req.params;
    const findByChampionName = await mongoose.connection.collection("champion").findOne({ name });
    res.json(findByChampionName);
  } catch (error) {
    console.error("에러 발생:", error);
    res.status(500).send("서버 에러");
  }
});

export default router;