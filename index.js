import { VK, API } from "vk-io";
import express from "express";
import ejs from "ejs";

import fs from "fs";
import { fileURLToPath } from "url";
import { dirname } from "path";

import { updateData } from "./autoUpdateData.js";
import { sendPage } from "./senderPage.js";
import { checkUser } from "./checkUser.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = 3000;

const communityToken = "vk1.a.qYx78tkRDVIxTOsiCVXmMSL6uzumB13FVDAkX1NFgEcLV6QLmz4CnPHv1vZnj6E_7em-Yvs8ty-TMpdIpVtuMGpLEjPjyqM2EvHUgjNQvE1qFA1aTNPAD4YSPl97kiS3Gh5kiWC1VhKVygobSCYw8jMnfiEMv6x75bQm_Dzyw5-JNTyFOPZWTAlq2JHScfXU6nsth-gXVoObAKKN7n0MGw";
const userToken = "vk1.a.rH7L7t96ZGOqE6Pxv_BpIGqzTqw0tkA8e0-AlijD1tpi45Zj3NRTHA05hw1Oe_2s4fb6SbDK6cm3lqvttvofuyP3TRbDwTtkP1Bjrr3q-uG2cUVkTzzPTRwwlWo0VxYpg-qmzp_OUMJXENC3EbJ6LXXfd8dZk5LFbTTIkbkpvp5tCMYW65GIlO7T0kpMEPffDOftFvHUupuRkT8D5Dxmng";

app.use(express.static("public"));
app.set("view engine", "ejs");

app.get("/", (req, res) => {
  sendPage(req, res);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

function randomInteger(min, max) {
  let rand = min + Math.random() * (max + 1 - min);
  return Math.floor(rand);
}

const notifications = {
  positive: ["Yep! Ты оказался прав!", "Поздравляю! Подарок твой)", "Ничего себе! Как у тебя это получилось? Приз в твоих руках)"],
  negative: ["Увы(", "Тебе не повезло(", "Ты был близок", "Зато повезет в чем-нибудь другом"],
};

let fileData = {
  id: -1,
  prefix: "",
  answPrefix: "",
  answers: [],
  min: [],
  max: [],
};

setInterval(() => {
  fileData = updateData();
}, 5000);

const vk = new VK({
  token: communityToken,
});

const api = new API({
  token: userToken,
});

vk.updates.on("wall_post_new", async (context) => {
  const reg = new RegExp(`${fileData.prefix}`);
  if (context.wall.text.search(reg) == -1) return;
  let file = fs.readFileSync("Posts Data.txt").toString();
  const re = /ID\sпоста:\s.*;/;
  const newFile = file.replace(re, `ID поста: ${context.wall.id};`);
  console.log(newFile);
  fs.writeFileSync("Posts Data.txt", newFile);
  fs.writeFileSync("checked_cells.txt", "");
});

vk.updates.on("wall_reply_new", async (context) => {
  const reg = new RegExp(`${fileData.answPrefix}\\d`);

  console.log(context);

  if (context.objectId != fileData.id || !context.isUser || context.text.search(reg) == -1 || context.replyId != undefined) return;
  const numOfAttempts = checkUser(context.fromId);

  let replay = "";
  if (numOfAttempts) {
    const userAnswer = context.text.match(/\d+/)[0];
    const findAnswer = fileData.answers.findIndex((el) => el == userAnswer);

    if (findAnswer != -1) {
      fileData.answers.splice(findAnswer, 1);
      const str = `ID поста: ${fileData.id}; --Данное поле заполнится автоматически при создании поста--\nПрефикс поста: ${fileData.prefix};\nПрефикс ответа: ${fileData.answPrefix};\nОтветы: ${fileData.answers};\nДиапозон ответов: ${fileData.min}-${fileData.max};`;
      fs.writeFileSync("Posts Data.txt", str);
      replay = notifications.positive[randomInteger(0, notifications.positive.length - 1)];
      const user = await api.users.get({
        user_ids: context.fromId,
        fields: ["screen_name", "photo_200"],
      });
      console.log(user);

      let participants = fs.readFileSync("participants.txt").toString();
      const re = new RegExp(`${context.fromId}-\\d`);
      const newParticipants = participants.replace(re, `${context.fromId}-0`);
      fs.writeFileSync("participants.txt", newParticipants);
      const wenerData = `Имя: ${user[0].first_name};\nФамилия: ${user[0].last_name};\nФото: ${user[0].photo_200};\nСсылка: https://vk.com/${user[0].screen_name};\nОтвет: ${userAnswer};\n\n`;
      fs.appendFileSync("Winers.txt", wenerData);
    } else {
      let countAttemptsStr = ` (Осталось ${numOfAttempts} попытки)`; // 2
      if (numOfAttempts == "1") countAttemptsStr = ` (Осталась ${numOfAttempts} попытка)`; // 1
      if (numOfAttempts == "0") countAttemptsStr = ` (Осталось ${numOfAttempts} попыток)`; // 0
      replay = notifications.negative[randomInteger(0, notifications.negative.length - 1)] + countAttemptsStr;
    }

    fs.appendFileSync("checked_cells.txt", `${userAnswer},`);
    console.log(replay);
  } else {
    replay = "Прости, друг, попыток больше нет(";
  }
  await api.wall.createComment({
    owner_id: context.ownerId,
    post_id: context.objectId,
    from_group: context.ownerId * -1,
    message: replay,
    reply_to_comment: context.id,
  });
});

await vk.updates.start();
