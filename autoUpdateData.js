import fs from "fs";

export function updateData() {
  const fileData = {
    id: -1,
    prefix: "",
    answPrefix: "",
    answers: [],
    min: [],
    max: [],
  };

  fs.readFile("Posts Data.txt", function (error, data) {
    if (error) {
      // если возникла ошибка
      return console.log(error);
    }
    fileData.id = Number(data.toString().split("ID поста: ")[1].split(";")[0]);
    fileData.prefix = data.toString().split("Префикс поста: ")[1].split(";")[0];
    fileData.answPrefix = data.toString().split("Префикс ответа: ")[1].split(";")[0];
    const answersStr = data.toString().split("Ответы: ")[1].split(";")[0];
    fileData.answers = answersStr.split(",");
    const range = data.toString().split("Диапозон ответов: ")[1].split(";")[0].split("-");
    fileData.min = range[0];
    fileData.max = range[1];
  });
  return fileData;
}
