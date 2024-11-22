import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import session from "express-session";
import MongoStore from "connect-mongo";
import gymLeaderRouter from "./gym-leader.js";
import eliteFourRouter from "./elite-four.js";
import championRouter from "./champion.js";
import userRouter from "./user.js";
import eventRouter from "./event.js";
import postingRouter from "./posting.js";

dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors({
  origin: "https://pokehub-encyclopedia.vercel.app",
  credentials: true,
}));

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  proxy: true,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24,
    secure: true,
    sameSite: "none",
  },
  store: MongoStore.create({
    mongoUrl: process.env.DB_URL,
  }),
}));

// MongoDB 연결 설정
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DB_URL);
    console.log("DB 연결 성공");
  } catch (error) {
    console.error("DB 연결 에러:", error);
    process.exit(1); // 연결 실패 시 프로세스 종료
  }
};

// MongoDB 연결 상태 디버깅
const db = mongoose.connection;
db.on("connected", () => console.log("Mongoose 연결 성공"));
db.on("error", (err) => console.error("Mongoose 연결 에러:", err));
db.on("disconnected", () => console.log("Mongoose 연결 해제"));

app.use("/gym-leader", gymLeaderRouter);
app.use("/elite-four", eliteFourRouter);
app.use("/champion", championRouter);
app.use("/", userRouter);
app.use("/event", eventRouter);
app.use("/board", postingRouter);

// DB 연결 실행
connectDB();

export default app;