import express from "express";
import bcrypt from "bcrypt";
import { User } from "./schema";
import { Post } from "./schema";
import mongoose from "mongoose";

const router = express.Router();

router.get("/page/1", async (req, res) => {
  try {
    // 세션에 사용자 정보가 있으면 반환
    if (req.session && req.session.user) {
      const user = await req.session.user;
      console.log(user);
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
  } else if (!user) {
    res.status(401).json({ message: '존재하지 않는 이메일입니다.' });
  } else if (!(await bcrypt.compare(password, user.password))) {
    res.status(401).json({ message: '비밀번호가 틀렸습니다.' });
  }
});

router.get("/board" , async(req,res) => {
  try{
    const posting = await mongoose.connection.collection("post").find().limit(0).toArray();
    res.json(posting);
  }catch(error){
    console.error("글 목록 가져오는 중 오류 발생:", error);
    res.status(500).json({ message: '글 목록 가져오는 중 오류 발생' });
  }
})

// router.get("/board/:postId" , async(req,res) => {
  
// })

router.post("/board/write", async (req, res) => {
  try {
    const { title, content } = req.body;
    const userId = req.session.user._id;

    if (!userId) {
      return res.status(401).json({ message: '로그인이 필요합니다.' });
    }

    // userId로 User 모델에서 사용자 찾기
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: '사용자를 찾을 수 없습니다.' });
    }

    // newPost 생성 시 userId와 username 추가
    const newPost = new Post({
      userId,
      username: user.username, // User 모델에서 가져온 username 추가
      title,
      content,
    });

    await newPost.save();
    res.status(200).json({ newPost });
  } catch (error) {
    console.error("글 작성 중 오류 발생:", error);
    res.status(500).json({ message: '글 작성 중 오류 발생' });
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


export default router;