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

export const GymLeader = mongoose.model("GymLeader", gymLeaderSchema , "gym-leader");
export const EliteFour = mongoose.model("EliteFour", eliteFourSchema , "elite-four");
export const Champion = mongoose.model("Champion", championSchema, "champion");