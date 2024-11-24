import express from "express";
import bcrypt from "bcrypt";
import { User } from "./schema.js";
import mongoose from "mongoose";

const router = express.Router();

router.get("/", async (req,res) => {
  const apiRequestFormat = {
    "BASE_URL": "https://pokehub-back.vercel.app",
    "1. 인물 정보": {
        "1.1 포켓몬 관장 정보(All)": `https://pokehub-back.vercel.app/gym-leader`,
        "1.2 포켓몬 관장 정보(Detail)": `https://pokehub-back.vercel.app/gym-leader/detail/{gymLeader.order}`,
        "1.3 포켓몬 사천왕 정보(All)": `https://pokehub-back.vercel.app/elite-four`,
        "1.4 포켓몬 사천왕 정보(Detail)": `https://pokehub-back.vercel.app/elite-four/detail/{eliteFour.order}`,
        "1.5 포켓몬 챔피언 정보(All)": `https://pokehub-back.vercel.app/champion`,
        "1.6 포켓몬 챔피언 정보(Detail)": `https://pokehub-back.vercel.app/champion/detail/{champion.order}`
    },
    "2. 이벤트": {
        "2.1 이벤트 카드(All)": "Link to https://pokemonkorea.co.kr/news",
        "2.2": `https://pokehub-back.vercel.app/event`
    },
    "3. 게시판": {
        "3.1 게시글(페이지)": `https://pokehub-back.vercel.app/board/{paginationNumber}`,
        "3.2": `https://pokehub-back.vercel.app/board/detail/(posting._id)`
    },
    "4. 프로필": {
        "4.1 프로필": `https://pokehub-back.vercel.app/profile/{userId}`
    }
  };
  // send JSON  API Architecture 
  res.json(apiRequestFormat);
});

router.get("/pokemon/1", async (req, res) => {
  try {
    // 세션에 사용자 정보가 있으면 반환
    if (req.session && req.session.user) {
      const user = await req.session.user;

      res.status(200).json({ user });
    } else {
      res.status(401).json({ message: "로그인되지 않은 상태입니다." });
    }
  } catch (error) {
    console.log("로그인 되지 않음:", error);
    res.status(500).json({ message: "서버 오류" });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  
  const user = await User.findOne({ email });

  if (user && (await bcrypt.compare(password, user.password))) {
    req.session.user = user; // 세션에 사용자 정보 저장
    res.status(200).json({ message: '로그인 성공', user });
  } else if (!user || !(await bcrypt.compare(password, user.password))) {
    res.status(400).send('존재하지 않는 이메일 주소이거나 비밀번호가 일치하지 않습니다..');
  }
});

router.post("/join", async (req, res) => {
  try {
    const {
      username,
      email,
      password,
      password_confirm,
    } = req.body;

    const existUserEmail = await User.findOne({ email });
    const existUserName = await User.findOne({ username });

    if (existUserName) {
      return res.status(400).send("동일한 유저 닉네임이 이미 존재합니다.");
    } else if(existUserEmail){
      return res.status(401).send("동일한 주소의 이메일이 이미 존재합니다.");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const hashedPassword_confirm = await bcrypt.hash(password_confirm, 10);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      password_confirm: hashedPassword_confirm,
    });

    await newUser.save();

    res.status(200).json({ newUser });
  } catch (error) {
    console.error("계정 생성 중 오류 발생:", error);
    res.status(500).json({ message: '계정 생성 중 오류 발생' });
  }
});

router.post("/logout", (req, res) => {
  req.session.destroy((error) => {
    if (error) {
      console.error("세션 삭제 중 에러:", error);
      res.status(500).json({ message: '로그아웃 실패' });
    } else {
      res.clearCookie('connect.sid'); // connect.sid는 세션 쿠키의 이름
      res.status(200).json({ message: '로그아웃 성공' });
    }
  });
});

router.get("/profile/:userId", async(req,res) => {
  try {
    if (req.session && req.session.user) {
      const user = await req.session.user;
      const { userId } = req.params;
      const userPosting = await mongoose.connection.collection("post").find({ userId: new mongoose.Types.ObjectId(userId) }).toArray();
      const userLiked = await mongoose.connection.collection("post").find({ likes: new mongoose.Types.ObjectId(userId) }).toArray();

      res.status(200).json({ user, userPosting, userLiked });
    } else {
      res.status(401).json({ message: "유저 프로필 정보를 가져오지 못함." });
    }
  } catch (error) {
    console.log("유저 프로필 정보를 가져오는 중 에러 발생.:", error);
    res.status(500).json({ message: "서버 오류" });
  }
});

export default router;