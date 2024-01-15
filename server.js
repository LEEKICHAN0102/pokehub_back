import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import gymLeaderRouter from "./gym-leader";
import championRouter from "./champion";

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

const championSchema = new mongoose.Schema({
  name: String,
  introduction: String,
  quote: String,
  gender: String,
  region: String,
  gym: String,
  type: String,
  image: {
    inGame: String,
    full: String,
    sprite_video: {
      type: String,
      default: undefined,
    },
  },
  information: String,
  bgm: {
    last_battle: String,
    theme: {
      type: String,
      default: undefined,
    },
    gym_leader: {
      type: String,
      default: undefined,
    },
  }
});

export const GymLeader = mongoose.model("GymLeader", gymLeaderSchema);
export const Champion = mongoose.model("Champion", championSchema);

const db = mongoose.connection;
db.on("error", console.error.bind(console, "DB 에러"));
db.once("open", function () {
  console.log("DB 연결 성공");
});

app.use("/gym-leader", gymLeaderRouter);
app.use("/champion", championRouter);

// 서버 시작
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});