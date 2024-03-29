import express from "express";
import bcrypt from "bcrypt";
import { Reply, User, Post, Comment } from "../schema/schema.js";
import mongoose from "mongoose";

const router = express.Router();

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

router.get("/board/:page", async (req, res) => {
  try {
    const { page } = req.params;
    const pageSize = 20;
    const skip = (page - 1) * pageSize;

    const totalCount = await mongoose.connection.collection("post").countDocuments();
    const posting = await mongoose.connection.collection("post").find().sort({ createdAt: -1 }).skip(skip).limit(pageSize).toArray();

    res.status(200).json({ posting, totalCount });
  } catch (error) {
    console.error("글 목록 가져오는 중 오류 발생:", error);
    res.status(500).json({ message: '글 목록 가져오는 중 오류 발생' });
  }
});

router.post("/board/write", async (req, res) => {
  try {
    const { title, content } = req.body;
    const userId = await req.session.user._id;

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

router.get("/board/detail/:postId", async (req, res) => {
  try {
    const { postId } = req.params;

    const [findByPostId, findCommentByPostId, findReplyByCommentId] = await Promise.all([
      mongoose.connection.collection("post").findOne({ _id: new mongoose.Types.ObjectId(postId) }),
      mongoose.connection.collection("comment").find({ postId: new mongoose.Types.ObjectId(postId) }).toArray(),
      mongoose.connection.collection("reply").find({ postId: new mongoose.Types.ObjectId(postId) }).toArray(),
    ]);

    res.status(200).json({ findByPostId, findCommentByPostId, findReplyByCommentId });
  } catch (error) {
    console.error("포스팅, 댓글 및 답글 가져오는 중 에러 발생:", error);
    res.status(500).send("서버 에러");
  }
});

router.put("/board/edit/:postId", async(req,res) => {
  try {
    const { postId } = req.params;
    const { editTitle, editContent } = req.body;

    const updatedPost = await mongoose.connection.collection("post").findOneAndUpdate(
      { _id: new mongoose.Types.ObjectId(postId) },
      { $set: { title: editTitle , content: editContent }},
      { new: true }
    );
    
    res.status(200).json({ updatedPost });
  } catch (error) {
    console.error("포스팅 수정 중 에러 발생:", error);
    res.status(500).send("서버 에러");
  }
})

router.delete("/board/detail/:postId/delete", async(req,res) => {
  try {
    const { postId } = req.params;

    const [deleteByPostId, deleteComments, deleteReplies] = await Promise.all([
      mongoose.connection.collection("post").findOneAndDelete({ _id: new mongoose.Types.ObjectId(postId) }),
      mongoose.connection.collection("comment").deleteMany({ postId: new mongoose.Types.ObjectId(postId) }),
      mongoose.connection.collection("reply").deleteMany({ postId: new mongoose.Types.ObjectId(postId) }),
    ]);

    res.status(200).json({ deleteByPostId, deleteComments, deleteReplies });
  } catch (error) {
    console.error("포스팅, 댓글 및 답글 삭제 중 에러 발생:", error);
    res.status(500).send("서버 에러");
  }
})


router.post("/board/detail/:postId", async (req, res) => {
  try {
    const { postId } = req.params;
    const { content } = req.body;
    const userId = await req.session.user._id;

    if (!userId) {
      return res.status(401).json({ message: '로그인이 필요합니다.' });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: '사용자를 찾을 수 없습니다.' });
    }

    const newComment = new Comment({
      userId,
      username: user.username,
      postId,
      content,
    });

    await newComment.save();
    res.status(200).json({ newComment });
  } catch (error) {
    console.error("댓글 포스팅 중 에러 발생:", error);
    res.status(500).send("서버 에러");
  }
});

router.delete("/board/detail/:postId/:commentId/deleteComment", async(req,res) => {
  try{
    const { commentId } = req.params;
    
    const [deleteComment, deleteCommentReplies] = await Promise.all([
      mongoose.connection.collection("comment").deleteOne({ _id: new mongoose.Types.ObjectId(commentId) }),
      mongoose.connection.collection("reply").deleteMany({ commentId: new mongoose.Types.ObjectId(commentId) }),
    ]);

    res.status(200).json({ deleteComment, deleteCommentReplies });
  }catch(error){
    console.error("댓글 & (해당 하는 답글) 삭제 중 에러 발생:", error);
    res.status(500).send("서버 에러");
  }
})

router.put("/board/detail/:postId/:commentId/updateComment", async (req, res) => {
  try {
    const { commentId } = req.params;
    const { editContent } = req.body;

    const updatedComment = await mongoose.connection.collection("comment").findOneAndUpdate(
      { _id: new mongoose.Types.ObjectId(commentId) },
      { $set: { content: editContent } },
      { new: true }
    );
    
    res.status(200).json({ updatedComment });
  } catch (error) {
    console.error("댓글 수정 중 에러 발생:", error);
    res.status(500).send("서버 에러");
  }
});


router.post("/board/detail/like/:postId", async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.session.user._id;

    if (!userId) {
      console.error("로그인이 필요합니다.");
      return res.status(401).json({ message: '로그인이 필요합니다.' });
    }

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ message: '게시물을 찾을 수 없습니다.' });
    }

    const existingLikeIndex = post.likes.indexOf(userId);

    if (existingLikeIndex !== -1) {
      // 이미 좋아요를 누른 경우, 좋아요 취소
      post.likes.splice(existingLikeIndex, 1);
      post.likeCount -= 1;
      await post.save();
      return res.status(200).json({ message: '좋아요 취소' });
    }

    // 좋아요 추가
    post.likes.push(userId);
    post.likeCount += 1;
    await post.save();

    console.log("좋아요가 성공적으로 저장되었습니다.");

    res.status(200).send(`좋아요 누른 userId: ${userId}, 좋아요 누른 postId: ${postId}`);
  } catch (error) {
    console.error("좋아요 중 에러 발생:", error);
    res.status(500).json({ message: '서버 에러', error: error.message });
  }
});

router.post("/board/detail/:postId/:commentId", async (req, res) => {
  try {
    const { postId, commentId } = req.params;
    const { replyContent } = req.body;
    const userId = await req.session.user._id;

    if (!userId) {
      console.error("로그인이 필요합니다.");
      return res.status(401).json({ message: '로그인이 필요합니다.' });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: '사용자를 찾을 수 없습니다.' });
    }

    const newReply = new Reply({
      userId,
      postId: postId,
      commentId: commentId,
      username: user.username,
      replyContent,
    });

    await newReply.save();
    res.status(200).json({ newReply });
  } catch (error) {
    console.error("답글 포스팅 중 에러 발생:", error);
    res.status(500).json({ message: '서버 에러', error: error.message });
  }
});

router.delete("/board/detail/:postId/:replyId/deleteReply", async(req,res) => {
  try{
    const { replyId } = req.params;
    
    const [deleteReply] = await Promise.all([
      mongoose.connection.collection("reply").deleteOne({ _id: new mongoose.Types.ObjectId(replyId) }),
    ]);

    res.status(200).json({ deleteReply });
  }catch(error){
    console.error("답글 삭제 중 에러 발생:", error);
    res.status(500).send("서버 에러");
  }
})

router.put("/board/detail/:postId/:replyId/updateReply", async (req, res) => {
  try {
    const { replyId } = req.params;
    const { editReply } = req.body;

    const updatedReply = await mongoose.connection.collection("reply").findOneAndUpdate(
      { _id: new mongoose.Types.ObjectId(replyId) },
      { $set: { replyContent: editReply } },
      { new: true }
    );
    
    res.status(200).json({ updatedReply });
  } catch (error) {
    console.error("답글 수정 중 에러 발생:", error);
    res.status(500).send("서버 에러");
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