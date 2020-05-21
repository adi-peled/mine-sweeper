// // Step1 – the seed app: 
// 1. Create a 4x4 gBoard Matrix containing Objects.
// Place 2 mines manually when each cell’s isShown set to true.
//  2. Present the mines using renderBoard() function. 
// Step2 – counting neighbors: 
// 1. Create setMinesNegsCount() and store the numbers (isShown is still true)
// 2. Present the board with the neighbor count and the mines using renderBoard() function.
// 3. Have a console.log presenting the board content – to help you with debugging 
const MINE = '💣'
const FLAG = '🚩'
var smile;
const live = '❤️'
var gGame;
var gCountShow;
var gBoard;
var gCountMines = 0
var gCountLives = 3
var gSafeCells;
var gSafeClicksCount;
function init(length, minesCount) {
    gGame = { isOn: true, shownCount: 0, markedCount: 0 }
    smile = '😐'
    gCountMines = 0
    document.querySelector('.smile').innerText = smile
    document.querySelector('.lives').innerText = 'lives: '
    updateLives(3)
    gBoard = buildBoard(length)
    buildMines(minesCount)
    gGame.shownCount = length ** 2 - minesCount
    renderBoard(gBoard)
    printBorad(gBoard)
    clearInterval(gIntervalId)
    document.querySelector('.timer').innerText = ' timer : 0'
    document.querySelector('.winOrLose').innerText = ' '
    countClick = 0
    gCountShow = 0;
    gSafeClicksCount = 3
    document.querySelector('.safeClick').innerText = ' safe click:' + gSafeClicksCount
}
function buildMines(count) {
    for (var k = 0; k < count; k++) {
        var random = Math.floor(Math.random() * gBoard.length)
        var i = random
        random = Math.floor(Math.random() * gBoard.length)
        var j = random

        var cell = gBoard[i][j]
        if (cell.isMine === true) {
            buildMines(1)
        }
        gCountMines++
        cell.isMine = true

    }
}
function buildBoard(length) {
    var board = []
    for (var i = 0; i < length; i++) {
        board[i] = []
        for (var j = 0; j < length; j++) {
            var cell = { minesAroundCount: 0, isShown: false, isMine: false, isMarked: false, }
            board[i][j] = cell
        }
    }
    return board
}


function renderBoard(board) {
    var strHtml = '';
    for (var i = 0; i < board.length; i++) {
        var row = board[i];
        strHtml += '<tr>';
        for (var j = 0; j < row.length; j++) {
            var cell = ' '
            strHtml += `<td class=" cell i-${i}-j-${j}" oncontextmenu="putFlag(this,${i},${j}) ; return false" onclick="cellClicked(this,${i},${j})">  ${cell}  </td>`
        }
        strHtml += '</tr>';
    }
    var elMat = document.querySelector('.game-board');
    elMat.innerHTML = strHtml;
}
function printBorad(board) {
    for (var i = 0; i < board.length; i++) {
        var row = board[i];
        for (var j = 0; j < row.length; j++) {
            setMinesNegsCount(i, j, board)
        }
    }
}
function setMinesNegsCount(cellI, cellJ, board) {
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= board.length) continue
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (j < 0 || j >= board[i].length) continue;
            if (i === cellI && j === cellJ) continue;
            var currCell = gBoard[cellI][cellJ]
            var cell = gBoard[i][j]
            if (currCell.isMine === true) return
            if (cell.isMine === true) currCell.minesAroundCount++
        }
    }
    var elTd = document.querySelector(`.i-${cellI}-j-${cellJ}`)
    return currCell
}
var gIntervalId
var countClick = 0
function cellClicked(cell, i, j) {

    if (gGame.isOn === false) return
    if (gBoard[i][j].isMine === false) {
        cell.style.backgroundColor = 'blue'
    }
    var timer = 0
    countClick++
    if (countClick === 1) {
        gIntervalId = setInterval(function () {
            timer += 0.078
            document.querySelector('.timer').innerText = 'timer: ' + timer.toFixed(3)
        }, 78);

    }

    if (gBoard[i][j].isShown === true) { return }
    if (gBoard[i][j].isMine === true) {
        gCountLives--
        document.querySelector('.lives').innerText = 'lives :'
        document.querySelector('.wrong').innerText = 'wrong, try again'
        document.querySelector('.wrong').style.backgroundColor = 'red'
        setTimeout(function () {
            document.querySelector('.wrong').innerText = ''
            document.querySelector('.wrong').style.backgroundColor = 'white'
        }, 1000);
        if (gCountLives === 0) {
            cell.innerText = MINE
            gameOver()
        } else {
            updateLives(gCountLives)
        }
    } else if (gBoard[i][j].minesAroundCount === 0) {
        checkMines(cell, i, j)
        cell.innerText = ''
    } else {
        checkMines(cell, i, j)
        cell.innerText = gBoard[i][j].minesAroundCount
    }
    console.log(timer)
    win()
}
function checkMines(cell, cellI, cellJ) {
    gBoard[cellI][cellJ].isShown = true
    gCountShow++
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= gBoard.length) continue
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (j < 0 || j >= gBoard[i].length) continue;
            if (i === cellI && j === cellJ) continue;
            var neigCell = document.querySelector(`.i-${i}-j-${j}`)
            if (gBoard[cellI][cellJ].isMine === true) {
                return
            } else if (gBoard[i][j].isMine === true) {
                continue
            } else {

                if (gBoard[i][j].isShown === true) {
                    return
                } else {
                    gBoard[i][j].isShown = true
                    gCountShow++
                }
                neigCell.innerText = gBoard[i][j].minesAroundCount
                if (neigCell.innerText === '0') neigCell.innerText = ' '
            }
            if (gBoard[i][j].isShown === true)
                document.querySelector(`.i-${i}-j-${j}`).style.backgroundColor = 'blue'
        }
    }
}
function gameOver(board) {
    gGame.isOn = false
    document.querySelector('.winOrLose').innerText = 'you lost'
    clearInterval(gIntervalId)
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[i].length; j++) {
            if (gBoard[i][j].isMine === true) {

                var elTd = document.querySelector(`.i-${i}-j-${j}`)

                elTd.innerText = MINE
                elTd.style.backgroundColor = 'red'
            }
        }
    }
    smile = '😵'
    document.querySelector('.smile').innerText = smile
}
function putFlag(cell, i, j) {

    if (gGame.isOn === false) { return }

    gGame.markedCount = 0
    if (cell.innerText === FLAG) {
        cell.innerText = ''
        gBoard[i][j].isMarked = false
    }
    else {
        cell.innerText = FLAG
        gBoard[i][j].isMarked = true
    }
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard.length; j++) {
            if (gBoard[i][j].isMarked === true && gBoard[i][j].isMine === true) {
                gGame.markedCount++
            }
        }
    }
    win()
}
localStorage.setItem('best time', Infinity)
function win() {
    if (gCountShow === gGame.shownCount && gCountMines === gGame.markedCount) {
        var cells = document.querySelectorAll('.cell')
        for (var i = 0; i < cells.length; i++) {
            cells[i].style.backgroundColor = 'blue'
        }
        document.querySelector('.winOrLose').innerText = 'you win'
        gGame.isOn = false
        smile = '😊'
        document.querySelector('.smile').innerText = smile
        clearInterval(gIntervalId)
        var bestTimeStr = document.querySelector('.timer').innerText
        var bestTime = bestTimeStr.split(':')
        var bestTimeNum = bestTime[1]
        console.log(bestTimeNum)
        console.log('local storage:', localStorage.getItem('best time'))
        if (localStorage.getItem('best time') > bestTimeNum) {
            localStorage.setItem('best time', bestTimeNum);
            document.querySelector('.bestTime').innerText = localStorage.getItem('best time', bestTimeNum);
        }
    }
}
function updateLives(num) {
    gCountLives = num
    for (var i = 0; i < num; i++) {
        document.querySelector('.lives').innerText += live
    }
}
function findSafeCells() {
    var safeCells = []
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[i].length; j++) {
            if (gBoard[i][j].isMine === false && gBoard[i][j].isShown === false) {
                var cell = document.querySelector(`.i-${i}-j-${j}`)
                safeCells.push(cell)
            }
        }
    }
    return safeCells
}
function showSafeClick() {
    if (gGame.isOn === false) { return }
    gSafeCells = findSafeCells()
    console.log()
    if (gSafeClicksCount <= 0) { return }
    gSafeClicksCount--
    document.querySelector('.safeClick').innerText = ' safe click:' + gSafeClicksCount
    var randomIdx = Math.floor(Math.random() * gSafeCells.length)
    var cell = gSafeCells[randomIdx]
    cell.style.backgroundColor = 'green'
    setTimeout(function () {
        cell.style.backgroundColor = 'lightblue';
    }, 2000);
    gSafeCells.splice(cell, 1)
}
