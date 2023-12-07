//htmlData <== Глобальная переменная из скрипта в html файле
const tableBox = document.querySelector(".table--wrapper");

function createTable(width, height) {
  let htmlStr = '<table class="table">';
  for (let i = 0; i < height; i++) {
    htmlStr += `<tr class="tr-${i}">`;

    for (let k = 0; k < width; k++) {
      htmlStr += `<td class="td-${i * width + k + 1}">`;
      htmlStr += `${i * width + k + 1}`;
      htmlStr += `</td">`;
    }

    htmlStr += `</tr">`;
  }
  htmlStr += "</table>";
  tableBox.insertAdjacentHTML("beforeend", htmlStr);
}
createTable(10, 10);

function setCheckedCells() {
  for (let i = 0; i < htmlData.checkedCells.length; i++) {
    const numOfCell = htmlData.checkedCells[i];
    const cell = document.querySelector(`.td-${numOfCell}`);
    cell.innerHTML = "";
    htmlStr = '<div class="closed-cell"></div>';
    cell.insertAdjacentHTML("beforeend", htmlStr);
  }
}
setCheckedCells();

function setWinnersToTable() {
  for (let i = 0; i < htmlData.winners.length; i++) {
    let name = htmlData.winners[i].name;
    let photo = htmlData.winners[i].photo;
    let link = htmlData.winners[i].link;
    let answer = htmlData.winners[i].answer;
    htmlStr = `<div class="winner-item"><a class="winner-link" href="${link}"><img class="winner-photo" src="${photo}" title="${name}"/></a></div>`;
    let cell = document.querySelector(`.td-${answer}`);
    cell.innerHTML = "";
    cell.insertAdjacentHTML("beforeend", htmlStr);
  }
}
setWinnersToTable();
