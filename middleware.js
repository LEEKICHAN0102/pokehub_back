const checkAuth = (req, res, next) => {
  if (req.session && req.session.user) {
    // 세션에 사용자 정보가 있으면 다음 미들웨어로 진행
    next();
  } else {
    // 세션에 사용자 정보가 없으면 로그인되지 않은 상태
    res.status(401).json({ message: "로그인되지 않은 상태입니다." });
  }
};

export default checkAuth;