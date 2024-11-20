import express from "express";
import mongoose from "mongoose";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const champions = await mongoose.connection.collection("champion").find().fetch();
    res.json(champions);
  } catch (error) {
    console.error("에러 발생:", error);
    res.status(500).send("서버 에러");
  }
});

router.get("/detail/:order", async (req, res) => {
  try {
    const { order } = req.params;
    const findByChampionOrder = await mongoose.connection.collection("champion").findOne({ order: Number(order) });
    res.json(findByChampionOrder);
  } catch (error) {
    console.error("에러 발생:", error);
    res.status(500).send("서버 에러");
  }
});

export default router;