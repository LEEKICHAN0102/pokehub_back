import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const PORT = process.env.PORT;
const app = express();

app.use(cors({
  origin: "http://localhost:3000", // 또는 프론트엔드 도메인
  credentials: true,
}));


// MongoDB 연결 설정
mongoose.connect(process.env.DB_URL);

const gymLeaderSchema = new mongoose.Schema({
  name: String,
  introduction: String,
  quote: String,
  gender: String,
  region: String,
  gym: String,
  badge: {
    name: String,
    image: String,
  },
  type: String,
  image: {
    inGame: String,
    full: String,
  },
  information: String,
});

export const GymLeader = mongoose.model("GymLeader", gymLeaderSchema);

const db = mongoose.connection;
db.on("error", console.error.bind(console, "DB 에러"));
db.once("open", function () {
  console.log("DB 연결 성공");
});

app.get("/gym-leader", async (req, res) => {
  try {
    // MongoDB에서 모든 Gym Leader 데이터 조회
    const gymLeaders = await mongoose.connection.collection("gym-leader").find().limit(0).toArray();

    // 조회된 데이터를 클라이언트에게 응답
    res.json(gymLeaders);
  } catch (error) {
    console.error("에러 발생:", error);
    res.status(500).send("서버 에러");
  }
});

app.get("/gym-leader/detail/:name", async (req, res) => {
  try {
    const { name } = req.params;

    const findByGymLeaderName = await mongoose.connection.collection("gym-leader").findOne({ name });

    // 조회된 데이터를 클라이언트에게 응답
    res.json(findByGymLeaderName);
  } catch (error) {
    console.error("에러 발생:", error);
    res.status(500).send("서버 에러");
  }
});

// 서버 시작
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});