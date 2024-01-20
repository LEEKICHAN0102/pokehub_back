import express from "express";
import bcrypt from "bcrypt";
import { User } from "./schema";
import checkAuth from "./middleware";

const router = express.Router();

router.get("/page/1", checkAuth, (req, res) => {
  try{
    // 세션에 사용자 정보가 있으면 반환
    const user = req.session.user;
    res.status(200).json({ user });
  } catch(error){
    console.log("로그인 되지 않음:", error);
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

    const users = await User.find();
    console.log("MongoDB:", users);

    res.send("계정 생성 완료!");
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