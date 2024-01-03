
/**
 * 说明：
 * row 代表行
 * column 代表列
 * block 代表 3×3 的方块，一个数独里有 9 个 block，
 * 从左到右，从上到下，从 1 开始编号，即：
 * 1 2 3
 * 4 5 6
 * 7 8 9
 */
//how to play game instruction
function help(){
 window.open(
"https://sudoku.com/how-to-play/sudoku-rules-for-complete-beginners/", "_blank");
}
var a = [1, 2, 3, 4, 5, 6, 7, 8, 9];
var difficulty = 3;
var randomComparator = function (a, b) {
return 0.5 - Math.random();
};
var sudoku = [
 [0, 0, 0, 0, 0, 0, 0, 0, 0],
 [0, 0, 0, 0, 0, 0, 0, 0, 0],
 [0, 0, 0, 0, 0, 0, 0, 0, 0],
 [0, 0, 0, 0, 0, 0, 0, 0, 0],
 [0, 0, 0, 0, 0, 0, 0, 0, 0],
 [0, 0, 0, 0, 0, 0, 0, 0, 0],
 [0, 0, 0, 0, 0, 0, 0, 0, 0],
 [0, 0, 0, 0, 0, 0, 0, 0, 0],
 [0, 0, 0, 0, 0, 0, 0, 0, 0]
];
var answer = [[], [], [], [], [], [], [], [], []];
var table = [[], [], [], [], [], [], [], [], []];
function checkColumn(col, x) {
for (var i = 0; i < 9; i++) {
if (sudoku[i][col] === x) {
return false;
 }
 }
// console.log("check column true");
return true;
}
function checkRow(row, x) {
for (var j = 0; j < 9; j++) {
if (sudoku[row][j] === x) {
return false;
 }
 }
// console.log("check row true");
return true;
}
function checkBlock(row, col, x) {
var startRow = Math.floor(row / 3) * 3;
var startCol = Math.floor(col / 3) * 3;
for (var i = 0; i < 3; i++) {
for (var j = 0; j < 3; j++) {
if (sudoku[startRow + i][startCol + j] === x) {
return false;
 }
 }
 }
// console.log("check block true");
return true;
}
function check(i, j, x) {
return checkRow(i, x) && checkColumn(j, x) && checkBlock(i, j, x);
}
function columnOK(col) {
var sum = 0;
for (var i = 0; i < 9; i++) {
 sum += sudoku[i][col];
 }
return sum === 45;
}
function columnsOK() {
for (var j = 0; j < 9; j++) {
if (!columnOK(j)) {
return false;
 }
 }
return true;
}
function rowOK(row) {
var sum = 0;
for (var j = 0; j < 9; j++) {
 sum += sudoku[row][j];
 }
return sum === 45;
}
function rowsOK() {
for (var i = 0; i < 9; i++) {
if (!rowOK(i)) {
return false;
 }
 }
return true;
}
function blockOK(n) {
var startRow = Math.floor((n - 1) / 3) * 3;
var startCol = (n - 1) % 3 * 3;
var sum = 0;
for (var i = 0; i < 3; i++) {
for (var j = 0; j < 3; j++) {
 sum += sudoku[startRow + i][startCol + j];
 }
 }
return sum === 45;
}
function blocksOK() {
for (var i = 1; i <= 9; i++) {
if (!blockOK(i)) {
return false;
 }
 }
return true;
}
function sudokuOK() {
return columnsOK() && rowsOK() && blocksOK();
}
// sudoku.js
let currentSessionId;
function generateSessionId() {
let sessionId = Date.now().toString(36) + Math.random().toString(36).substr(2);
// Display the session ID in the HTML
// document.getElementById('sessionId').textContent = sessionId;
return sessionId;
}
function tryit(i, j) {
// console.log("i: " + i + " j: " + j);
if (i >= 9) {
return true;
 }
var s = i;
var t = j + 1;
if (t >= 9) {
 t -= 9;
 s++;
 }
if (sudoku[i][j] !== 0) {
var success = tryit(s, t);
if (success) {
return true;
 }
 }
// console.log("s: " + s + " t: " + t);
for (var k = 0; k < 9; k++) {
if (check(i, j, a[k])) {
 sudoku[i][j] = a[k];
var success = tryit(s, t);
if (success) {
return true;
 }
 sudoku[i][j] = 0;
 }
 }
return false;
}
/**
 * 将 1-9 随机排序后，填充到 n 号 block 中
 */
function setBlockRandomly(n) {
var startRow = Math.floor((n - 1) / 3) * 3;
var startCol = (n - 1) % 3 * 3;
 a.sort(randomComparator);
for (var i = 0; i < 3; i++) {
for (var j = 0; j < 3; j++) {
 sudoku[startRow + i][startCol + j] = a[i * 3 + j];
 }
 }
}
/**
 * 将游戏面板的 DOM Element 保存到一个数组里
 */
function bindTable() {
var e = document.getElementById("sudoku").firstElementChild;
for (var i = 0; i < 9; i++) {
for (var j = 0; j < 9; j++) {
 table[i].push(e);
 e = e.nextElementSibling;
 }
 }
}
/**
 * 把二维数组 a 中的数据设置到游戏面板上
 */
function setTable(a) {
for (var i = 0; i < 9; i++) {
for (var j = 0; j < 9; j++) {
if (a[i][j] !== 0) {
 table[i][j].innerHTML = a[i][j];
 } else {
 table[i][j].innerHTML = '<input type="text" maxlength="1" onchange="onInput(' + i + ',' + j + ');"/>';
 }
 }
 }
}
function createSudoku() {
clear(sudoku); // 把 sudoku 的值都赋值为 0
// 随机填充编号为 3, 5, 7 的 block
// 因为这三个 block 值不相关, 因此可以随机填充
// 以减少搜索次数
setBlockRandomly(3);
setBlockRandomly(5);
setBlockRandomly(7);
 a.sort(randomComparator);
var success = tryit(0, 0);
return success;
}
function clear(arr) {
for (var i = 0; i < 9; i++) {
for (var j = 0; j < 9; j++) {
 arr[i][j] = 0;
 }
 }
}
/**
 * 复制一个 Numeric 型的二维数组
 */
function copy(arr) {
var a = [[], [], [], [], [], [], [], [], []];
for (var i = 0; i < 9; i++) {
for (var j = 0; j < 9; j++) {
 a[i].push(arr[i][j]);
 }
 }
return a;
}
function createGame() {
while (!createSudoku());
// 保存答案
 answer = copy(sudoku);
// 每行随机挖去几个数，挖的个数与难度有关
for (var i = 0; i < 9; i++) {
for (var j = 0; j < difficulty + Math.floor(Math.random() * 2); j++) {
 sudoku[i][Math.floor(Math.random() * 9)] = 0;
 }
 }
}
// 设置难度为简答
function easy() {
 difficulty = 3;
}
//设置难度为困难
function hard() {
 difficulty = 5;
}
// 设置难度为变态
function disgust() {
 difficulty = 7;
}
// 换一个数独
function change() {
 currentSessionId = generateSessionId();
    updateUrlWithSessionId(currentSessionId);
createGame();
setTable(sudoku);
}
// 查看答案
function showAnswer() {
setTable(answer);
endTimer();
}
// 处理输入
function onInput(i, j) {
if (!currentSessionId) {
 currentSessionId = generateSessionId();
updateUrlWithSessionId(currentSessionId);
// 可能还有其他相关的游戏开始逻辑
 }
var inputElement = table[i][j].firstElementChild;
var value = parseInt(inputElement.value);
// Validate the data
if (check(i, j, value)) {
 sudoku[i][j] = value;
// Optionally update the table cell directly, if needed
// table[i][j].innerHTML = value;
// Check if Sudoku is complete
if (sudokuOK()) {
gameOver();
 }
 } else {
alert('Wrong Answer, Please change to another number');
 inputElement.value = "";
 }
// Auto-save the state after each input (both valid and invalid)
autoSaveBoardState();
}
var timeStart;
var countTime = false;
var timeArea;
var count = 0;
var timerId = -1;
function startTimer() {
 timeStart = new Date();
 countTime = true;
 count = 0;
 timeArea.innerHTML = "00 : 00 : 00";
 timerId = setTimeout(timer, 1000);
 console.log(timerId);
}
function timer() {
 count++;
var h = pad(parseInt(count / 3600));
var m = pad(parseInt(count / 60));
var s = pad(parseInt(count % 60));
 timeArea.innerHTML = h + " : " + m + " : " + s;
if (countTime) {
 timerId = setTimeout(timer, 1000);
 }
}
function pad(i) {
if (i < 10) {
return "0" + i;
 }
return i;
}
function endTimer() {
 countTime = false;
clearTimeout(timerId);
 console.log(timerId);
}
function updateUrlWithSessionId(sessionId) {
const currentUrl = window.location.href.split('?')[0]; // 获取当前 URL，不包含任何参数
const newUrl = currentUrl + '?sessionId=' + sessionId; // 添加 session ID 作为参数
 window.history.pushState({ path: newUrl }, '', newUrl); // 更新 URL
}
function gameStart() {
endTimer();
change();
// currentSessionId = generateSessionId();
//
// updateUrlWithSessionId(currentSessionId);
startTimer();
}
function gameOver() {
endTimer();
var restart = confirm('Congratulations! You have finished this sudoku, click OK to start a new Game');
if(restart) {
gameStart();
 }
}
(function loading() {
bindTable();
 timeArea = document.getElementById("timer");
const urlParams = new URLSearchParams(window.location.search);
let sessionId = urlParams.get('sessionId');
if (sessionId) {
// 如果 URL 中已有 sessionId，则根据该 ID 加载游戏
loadGameFromSessionId(sessionId);
 } else {
// 如果 URL 中没有 sessionId，开始新游戏
// gameStart();
 }
})();
// function attachEventListenersToSudokuCells() {
// // Select all input elements within the Sudoku grid
// document.querySelectorAll('#sudoku li input').forEach(input => {
// // Getting the parent <li> element to access 'x' and 'y' attributes
// const parentLi = input.parentElement;
//
// // Extracting the row (i) and column (j) indices from the parent <li>
// const i = parseInt(parentLi.getAttribute('x'), 10);
// const j = parseInt(parentLi.getAttribute('y'), 10);
//
// // Attaching the event listener to the input element
// input.addEventListener('input', () => {
// onInput(i, j); // Calling onInput with the appropriate indices
// });
// });
// }
// document.addEventListener('DOMContentLoaded', attachEventListenersToSudokuCells);
//
function autoSaveBoardState() {
const state = captureBoardState();
const sessionId = getCurrentSessionId(); // Ensure you have a function to get the current session ID
const status = "in_process"
saveGameStateToServer(sessionId, state,status);
}
function captureBoardState() {
// let boardState = [];
// for (let x = 0; x < 9; x++) {
// let row = [];
// for (let y = 0; y < 9; y++) {
// // 选择每个单元格内的 input 元素
// let cellInput = document.querySelector(`li[x="${x}"][y="${y}"] input.sudoku-input`);
// // 如果找到 input 元素，则获取其值，否则使用 0
// let cellValue = cellInput ? cellInput.value : 0;
// // 将值转换为数字，如果是非数字或空字符串，则使用 0
// row.push(parseInt(cellValue, 10) || 0);
// }
// boardState.push(row);
// }
return sudoku;
}
function saveGameStateToServer(sessionId, state,status) {
fetch('http://localhost:3000/save-game', {
method: 'POST',
headers: {
'Content-Type': 'application/json',
 },
body: JSON.stringify({ sessionId, state,status })
 })
 .then(response => {
if (!response.ok) {
throw new Error('Network response was not ok ' + response.statusText);
 }
return response.json();
 })
 .then(data => console.log('Game state auto-saved:', data))
 .catch(error => console.error('Error during auto-save:', error));
}
function getCurrentSessionId() {
return currentSessionId;
// Retrieve or generate the current session ID
// This could be stored in localStorage, sessionStorage, or generated fresh
}
function loadGameFromSession() {
const sessionId = document.getElementById('sessionIdInput').value;
}
function reconstructGame(gameState) {
// Logic to update the Sudoku board based on the gameState
// For example:
 gameState.forEach((row, rowIndex) => {
 row.forEach((cellValue, columnIndex) => {
let cellInput = document.querySelector(`li[x="${rowIndex}"][y="${columnIndex}"]`);
// let cellInput = document.querySelector(`.sudoku-input[data-x="${rowIndex}"][data-y="${columnIndex}"]`);
if (cellInput) {
 cellInput.value = cellValue;
 sudoku[rowIndex][columnIndex] = cellValue;
 }
 });
 });
setTable(sudoku);
startTimer();
}
// document.getElementById('reloadButton').addEventListener('click', loadGameFromSession);
document.addEventListener('DOMContentLoaded', function() {
const urlParams = new URLSearchParams(window.location.search);
const sessionId = urlParams.get('sessionId');
// if (sessionId) {
// // 使用 session ID 加载游戏状态
// loadGameFromSessionId(sessionId);
// }
if (!sessionId) {
// sessionId = generateSessionId();
// updateUrlWithSessionId(sessionId);
gameStart(); // 创建新的数独游戏
 } else {
// 如果 URL 中已有 sessionId，则根据该 ID 加载游戏
loadGameFromSessionId(sessionId);
 }
});
function loadGameFromSessionId(sessionId) {
if (!sessionId) {
alert('Please enter a session ID.');
return;
 }
fetch(`http://localhost:3000/game/${sessionId}`)
 .then(response => {
if (!response.ok) {
throw new Error('Game not found for the provided session ID,'+ sessionId);
 }
return response.json();
 })
 .then(data => {
reconstructGame(data.state); // Assuming data.state is the game state
 })
 .catch(error => {
 console.error('Failed to load game:', error);
alert('Failed to load game: ' + error.message);
 });
}
