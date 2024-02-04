import express from "express";
import mongoose from "mongoose";
import { S3Client } from "@aws-sdk/client-s3";

const router = express.Router();

const s3 = new S3Client({
  region : "ap-northeast-2",
  credentials : {
      accessKeyId : process.env.S3_KEY,
      secretAccessKey : process.env.S3_SECRET,
  }
});

router.get("/", async (req, res) => {
  try {
    const champions = await mongoose.connection.collection("champion").find().toArray();

    // 각 챔피언의 이미지와 BGM 정보를 추가
    const championsWithS3Info = await Promise.all(champions.map(async (champion) => {
      // 이미지 정보 추가
      champion.image = champion.image || {};
      champion.image.inGame = `https://pokehub.s3.ap-northeast-2.amazonaws.com/champion/${champion.name}/image/inGame.webp`;
      champion.image.full = `https://pokehub.s3.ap-northeast-2.amazonaws.com/champion/${champion.name}/image/full.webp`;
      champion.image.sprite_video = `https://pokehub.s3.ap-northeast-2.amazonaws.com/champion/${champion.name}/image/sprite_video.mp4` || null;

      // BGM 정보 추가
      champion.bgm = champion.bgm || {};
      champion.bgm.last_battle = `https://pokehub.s3.ap-northeast-2.amazonaws.com/champion/${champion.name}/bgm/last_battle.mp3`;
      champion.bgm.battle = `https://pokehub.s3.ap-northeast-2.amazonaws.com/champion/${champion.name}/bgm/battle.mp3` || null;
      champion.bgm.theme = `https://pokehub.s3.ap-northeast-2.amazonaws.com/champion/${champion.name}/bgm/theme.mp3` || null;
      champion.bgm.gym_leader = `https://pokehub.s3.ap-northeast-2.amazonaws.com/champion/${champion.name}/bgm/gym_leader.mp3` || null;
      champion.bgm.victory = `https://pokehub.s3.ap-northeast-2.amazonaws.com/champion/${champion.name}/bgm/victory.mp3` || null;
      champion.bgm.chance_of_victory = `https://pokehub.s3.ap-northeast-2.amazonaws.com/champion/${champion.name}/bgm/chance_of_victory.mp3` || null;

      // 이미지 정보 업데이트
      await mongoose.connection.collection("champion").updateOne(
        { "name": champion.name },
        {
          "$set": {
            "image": {
              "full": champion.image.full,
              "inGame": champion.image.inGame,
              "sprite_video": champion.image.sprite_video,
            }
          }
        },
        { "upsert": true }
      );

      // BGM 정보 업데이트
      await mongoose.connection.collection("champion").updateOne(
        { "name": champion.name },
        {
          "$set": {
            "bgm": {
              "last_battle": champion.bgm.last_battle,
              "theme": champion.bgm.theme,
              "battle": champion.bgm.battle,
              "chance_of_victory": champion.bgm.chance_of_victory,
              "gym_leader": champion.bgm.gym_leader,
            }
          }
        },
        { "upsert": true }
      );
      return champion;
    }));

    console.log(championsWithS3Info);

    res.json(champions);
  } catch (error) {
    console.error("에러 발생:", error);
    res.status(500).send("서버 에러");
  }
});

router.get("/detail/:name", async (req, res) => {
  try {
    const { name } = req.params;
    const findByChampionName = await mongoose.connection.collection("champion").findOne({ name });
    res.json(findByChampionName);
  } catch (error) {
    console.error("에러 발생:", error);
    res.status(500).send("서버 에러");
  }
});

export default router;