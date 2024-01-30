import mongoose from "mongoose";

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

const eliteFourSchema = new mongoose.Schema({
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
  },
  information: String,
  bgm: {
    battle: String,
    theme: {
      type: String,
      default: undefined,
    },
  },
  ace_pokemon: Array,
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
  },
  ace_pokemon: Array,
});

const userSchema = new mongoose.Schema({ 
  username: String,
  email: String,
  password: String,
  password_confirm: String,
});

const postSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // User 모델과 연결
  },
  username: String,
  title: {
    type: String,
    required: true,
  },
  content: {
      type: String,
      required: true,
  },
  postingTime: {
    type: String,
    default: () => {
      const now = new Date(new Date().getTime());
      // "YYYY-MM-DD HH:mm" 형식으로 반환
      return `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')} ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    },
  },
});

const commentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // User 모델과 연결
  },
  username: String,
  content: String,
  postId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Post", // Post 모델과 연결
  },
  postingTime: {
    type: String,
    default: () => {
      const now = new Date(new Date().getTime());
      return `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')} ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    },
  },
});

const replySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // User 모델과 연결
  },
  postId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Post", // User 모델과 연결
  },
  commentId: { 
    type: mongoose.Schema.Types.ObjectId,
    ref: "Comment",
  },
  username: String,
  replyContent: String,
  postingTime: {
    type: String,
    default: () => {
      const now = new Date(new Date().getTime());
      return `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')} ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    },
  },
});

const LikeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // User 모델과 연결
  },
  postId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Post", // User 모델과 연결
  },
});

export const GymLeader = mongoose.model("GymLeader", gymLeaderSchema , "gym-leader");
export const EliteFour = mongoose.model("EliteFour", eliteFourSchema , "elite-four");
export const Champion = mongoose.model("Champion", championSchema, "champion");

export const User = mongoose.model("User", userSchema, "user");
export const Post = mongoose.model("Post", postSchema, "post");
export const Comment = mongoose.model("Comment", commentSchema, "comment");
export const Reply = mongoose.model("Reply", replySchema, "reply");
export const Like = mongoose.model("Like", LikeSchema, "like");