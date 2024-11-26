import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import session from "express-session";
import MongoStore from "connect-mongo";
import gymLeaderRouter from "./character/gym-leader.js";
import eliteFourRouter from "./character/elite-four.js";
import championRouter from "./character/champion.js";
import userRouter from "./user/user.js";
import eventRouter from "./event/event.js";
import postingRouter from "./posting/posting.js";

dotenv.config();

const app = express();

app.get("/", async (req,res) => {
  const apiRequestFormat = {
    "BASE_URL": "https://pokehub-encyclopedia.site",
    "1. 인물 정보": {
        "1.1 포켓몬 관장 정보(All)": `https://pokehub-encyclopedia.site/gym-leader`,
        "1.2 포켓몬 관장 정보(Detail)": `https://pokehub-encyclopedia.site/gym-leader/detail/{gymLeader.order}`,
        "1.3 포켓몬 사천왕 정보(All)": `https://pokehub-encyclopedia.site/elite-four`,
        "1.4 포켓몬 사천왕 정보(Detail)": `https://pokehub-encyclopedia.site/elite-four/detail/{eliteFour.order}`,
        "1.5 포켓몬 챔피언 정보(All)": `https://pokehub-encyclopedia.site/champion`,
        "1.6 포켓몬 챔피언 정보(Detail)": `https://pokehub-encyclopedia.site/champion/detail/{champion.order}`
    },
    "2. 이벤트": {
        "2.1 이벤트 카드(All)": "Link to https://pokemonkorea.co.kr/news",
        "2.2": `https://pokehub-encyclopedia.site/event`
    },
    "3. 게시판": {
        "3.1 게시글(페이지)": `https://pokehub-encyclopedia.site/board/{paginationNumber}`,
        "3.2": `https://pokehub-encyclopedia.site/board/detail/(posting._id)`
    },
    "4. 프로필": {
        "4.1 프로필": `https://pokehub-encyclopedia.site/profile/{userId}`
    }
  };
  res.json(apiRequestFormat);
});

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
    proxy: true,
    maxAge: 1000 * 60 * 60 * 24,
    secure: true,
    sameSite: "none",
    domain: ".pokehub-encyclopedia.site",
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

app.listen(process.env.PORT, () => {
  console.log(`Server is running on ${process.env.PORT}`);
});