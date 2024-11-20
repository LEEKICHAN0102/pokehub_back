import express from "express";
import { GymLeader } from "./schema.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const gymLeaders = await GymLeader.find();
    res.json(gymLeaders);
  } catch (error) {
    console.error("에러 발생:", error);
    res.status(500).send("서버 에러");
  }
});

router.get("/detail/:order", async (req, res) => {
  try {
    const { order } = req.params;
    const findByGymLeaderOrder = await GymLeader.findOne({ order: Number(order) });
    res.json(findByGymLeaderOrder);
  } catch (error) {
    console.error("에러 발생:", error);
    res.status(500).send("서버 에러");
  }
});

export default router;