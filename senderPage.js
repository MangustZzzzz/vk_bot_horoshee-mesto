import fs from "fs";

export function sendPage(req, res) {
  fs.readFile("Winers.txt", function (error, data) {
    if (error) {
      return console.log(error);
    }
    const strs = data.toString().split("\n");
    console.log(strs);
    const htmlData = { winners: [], checkedCells: [] };
    for (let i = 0; i < strs.length; i = i + 6) {
      if (strs[i] == "") {
        break;
      }
      htmlData.winners.push({
        name: strs[i].split("Имя: ")[1].split(";")[0],
        lastName: strs[i + 1].split("Фамилия: ")[1].split(";")[0],
        photo: strs[i + 2].split("Фото: ")[1].split(";")[0],
        link: strs[i + 3].split("Ссылка: ")[1].split(";")[0],
        answer: strs[i + 4].split("Ответ: ")[1].split(";")[0],
      });
    }
    const checkedCells = fs.readFileSync("checked_cells.txt").toString().split(",");
    checkedCells.pop();
    htmlData.checkedCells = checkedCells;
    console.log(htmlData);
    res.render("index", { htmlData });
  });
}
