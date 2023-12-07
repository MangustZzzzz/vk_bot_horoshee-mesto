import fs from "fs";

export function checkUser(idUser) {
  const eventParticipantsStr = fs.readFileSync("participants.txt").toString().split("\n");
  let flag = 3;
  for (let i = 0; i < eventParticipantsStr.length; i++) {
    const [id, attemptsLeft] = eventParticipantsStr[i].split("-");
    if (id == idUser && attemptsLeft > 0) {
      eventParticipantsStr[i] = `${idUser}-${attemptsLeft - 1}`;
      flag = attemptsLeft - 1;
      break;
    } else if (id == idUser && attemptsLeft <= 0) {
      flag = -1;
      break;
    }
  }
  if (flag == -1) {
    return false;
  } else if (flag == 3) {
    fs.appendFileSync("participants.txt", `${idUser}-2\n`);
    return "2";
  } else {
    const newData = eventParticipantsStr.join("\n");
    fs.writeFileSync("participants.txt", newData);
    return `${flag}`;
  }
}
