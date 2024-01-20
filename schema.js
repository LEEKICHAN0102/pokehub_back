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

const commentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // User 모델과 연결
  },
  content: String,
  postId: String,
});

const replySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // User 모델과 연결
  },
  content: String,
  commentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Comment', required: true },
});

export const GymLeader = mongoose.model("GymLeader", gymLeaderSchema , "gym-leader");
export const EliteFour = mongoose.model("EliteFour", eliteFourSchema , "elite-four");
export const Champion = mongoose.model("Champion", championSchema, "champion");

export const User = mongoose.model("User", userSchema, "user");
export const Comment = mongoose.model("Comment", commentSchema, "comment");
export const Reply = mongoose.model("Reply", replySchema, "reply");