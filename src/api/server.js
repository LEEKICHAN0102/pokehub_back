import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import session from "express-session";
import MongoStore from "connect-mongo";
import gymLeaderRouter from "../character/gym-leader.js";
import eliteFourRouter from "../character/elite-four.js";
import championRouter from "../character/champion.js";
import userRouter from "../user/user.js";
import eventRouter from "../event/event.js";
import postingRouter from "../posting/posting.js";

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
app.use("/board", postingRouter);

export default app;