import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import session from "express-session";
import MongoStore from "connect-mongo";
import gymLeaderRouter from "./gym-leader";
import eliteFourRouter from "./elite-four";
import championRouter from "./champion";
import userRouter from "./user";
import eventRouter from "./event";

dotenv.config();

const PORT = process.env.PORT;
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
  cookie: {
    maxAge: 1000 * 60 * 60 * 24,
    secure: false,
  },
  store: MongoStore.create({
    mongoUrl: process.env.DB_URL,
  }),
}));

// MongoDB 연결 설정
mongoose.connect(process.env.DB_URL);

const db = mongoose.connection;
db.on("error", console.error.bind(console, "DB 에러"));
db.once("open", function () {
  console.log("DB 연결 성공");
});

app.use("/gym-leader", gymLeaderRouter);
app.use("/elite-four", eliteFourRouter);
app.use("/champion", championRouter);
app.use("/", userRouter);
app.use("/event", eventRouter);

// 서버 시작
app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});