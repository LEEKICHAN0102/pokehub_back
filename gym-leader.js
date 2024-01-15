import express from "express";
import mongoose from "mongoose";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const gymLeaders = await mongoose.connection.collection("gym-leader").find().limit(0).toArray();
    res.json(gymLeaders);
  } catch (error) {
    console.error("에러 발생:", error);
    res.status(500).send("서버 에러");
  }
});

router.get("/detail/:name", async (req, res) => {
  try {
    const { name } = req.params;
    const findByGymLeaderName = await mongoose.connection.collection("gym-leader").findOne({ name });
    res.json(findByGymLeaderName);
  } catch (error) {
    console.error("에러 발생:", error);
    res.status(500).send("서버 에러");
  }
});

export default router;