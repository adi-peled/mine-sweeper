// // Step1 – the seed app: 
// 1. Create a 4x4 gBoard Matrix containing Objects.
// Place 2 mines manually when each cell’s isShown set to true.
//  2. Present the mines using renderBoard() function. 
// Step2 – counting neighbors: 
// 1. Create setMinesNegsCount() and store the numbers (isShown is still true)
// 2. Present the board with the neighbor count and the mines using renderBoard() function.
// 3. Have a console.log presenting the board content – to help you with debugging 




const MINE = '#'
const FLAG = 'F'
var gGame = { isOn: true, shownCount: 0, markedCount: 0, secsPassed: 0 }
var gBoard = buildBoard(4)
buildMines(2)
renderBoard(gBoard)
printBorad(gBoard)
function init(length, minesCount) {
    gGame.isOn = true
    gBoard = buildBoard(length)
    buildMines(minesCount)
    renderBoard(gBoard)
    printBorad(gBoard)
    clearInterval(gIntervalId)
    document.querySelector('.timer').innerText = ' timer : 0'
    document.querySelector('.winOrLose').innerText = ' '
    countClick = 0
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
            // var cell = gBoard[i][j]
            //var cellShow = cell.minesAroundCount
            var cell = 'x'
            // if (cell.isMine === true) {
            // cellShow = MINE
            // }
            strHtml += `<td class="i-${i}-j-${j}"    onclick="cellClicked(this,${i},${j})">  ${cell}  </td>`

        }
        strHtml += '</tr>';
    }
    var elMat = document.querySelector('.game-board');
    elMat.innerHTML = strHtml;
}







//Count mines around each cell and set the cell's minesAroundCount. 


//1. Create setMinesNegsCount() and store the numbers (isShown is still true) 
//2. Present the board with the neighbor count and the mines using renderBoard() function. 
//3. Have a console.log presenting the board content – to help you with debugging 

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
            //  console.log(currCell)
            if (currCell.isMine === true) return
            if (cell.isMine === true) currCell.minesAroundCount++
        }
    }
    var elTd = document.querySelector(`.i-${cellI}-j-${cellJ}`)
    // elTd.innerText = currCell.minesAroundCount
    //console.log(elTd)


    return currCell
}



//Implement that clicking a cell with “number” reveals the number of this cell 



var gIntervalId
var countClick = 0
function cellClicked(cell, i, j) {

    if (gGame.isOn === false) return


    var timer = 0
    countClick++
    if (countClick === 1) {

        gIntervalId = setInterval(function () {
            timer += 0.078
            document.querySelector('.timer').innerText = 'timer: ' + timer.toFixed(3)
        }, 78);
    }

    if (gBoard[i][j].isShown === true) { return }
    gBoard[i][j].isShown = true
    //   if (!(cell.innerText === 'x')) { return }
    if (gBoard[i][j].isMine === true) {
        console.log(gBoard[i][j])
        cell.innerText = MINE

        console.log(gBoard[i][j])
    } else if (gBoard[i][j].minesAroundCount === 0) {
        checkMines(cell, i, j)
        cell.innerText = ''
    } else {
        checkMines(cell, i, j)
        cell.innerText = gBoard[i][j].minesAroundCount
    }

    if (cell.innerText === MINE) {
        console.log('lost')
        document.querySelector('.winOrLose').innerText = 'you lost'
        gGame.isOn = false
        clearInterval(gIntervalId)
    }


    //document.querySelector
    //  console.log('borad:', gBoard)
    //  console.log('cell:', cell)
    gGame.shownCount++
}


function checkMines(cell, cellI, cellJ) {

    // console.log('cell : ', cell, 'i:', cellI, 'j:', cellJ)
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= gBoard.length) continue
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (j < 0 || j >= gBoard[i].length) continue;
            if (i === cellI && j === cellJ) continue;
            var currCell = gBoard[cellI][cellJ]
            var neigCell = document.querySelector(`.i-${i}-j-${j}`)
            // console.log(neigCell)
            // if (currCell.isMine === true) return
            if (gBoard[cellI][cellJ].isMine === true) {
                console.log(gBoard[cellI][cellJ])
                return
            } else if (gBoard[i][j].isMine === true) {
                continue
            } else {
                gBoard[i][j].isShown = true

                neigCell.innerText = gBoard[i][j].minesAroundCount
                if (neigCell.innerText === '0') neigCell.innerText = ' '
            }


        }

    }
}




