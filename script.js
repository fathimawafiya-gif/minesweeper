const boardElement = document.getElementById('game-board');
const restartButton = document.getElementById('restart-button');

const ROWS = 10;
const COLS = 10;
const MINES = 15;

let board = [];
let gameOver = false;

function init() {
    board = createBoard();
    placeMines(board);
    calculateAdjacentMines(board);
    renderBoard(board);
    gameOver = false;
}

function createBoard() {
    const newBoard = [];
    for (let i = 0; i < ROWS; i++) {
        newBoard[i] = [];
        for (let j = 0; j < COLS; j++) {
            newBoard[i][j] = {
                isMine: false,
                isRevealed: false,
                isFlagged: false,
                adjacentMines: 0
            };
        }
    }
    return newBoard;
}

function placeMines(board) {
    let minesPlaced = 0;
    while (minesPlaced < MINES) {
        const row = Math.floor(Math.random() * ROWS);
        const col = Math.floor(Math.random() * COLS);
        if (!board[row][col].isMine) {
            board[row][col].isMine = true;
            minesPlaced++;
        }
    }
}

function calculateAdjacentMines(board) {
    for (let i = 0; i < ROWS; i++) {
        for (let j = 0; j < COLS; j++) {
            if (!board[i][j].isMine) {
                let count = 0;
                for (let x = -1; x <= 1; x++) {
                    for (let y = -1; y <= 1; y++) {
                        const newRow = i + x;
                        const newCol = j + y;
                        if (newRow >= 0 && newRow < ROWS && newCol >= 0 && newCol < COLS && board[newRow][newCol].isMine) {
                            count++;
                        }
                    }
                }
                board[i][j].adjacentMines = count;
            }
        }
    }
}

function renderBoard(board) {
    boardElement.innerHTML = '';
    for (let i = 0; i < ROWS; i++) {
        for (let j = 0; j < COLS; j++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.dataset.row = i;
            cell.dataset.col = j;

            if (board[i][j].isRevealed) {
                cell.classList.add('revealed');
                if (board[i][j].isMine) {
                    cell.classList.add('mine');
                    cell.textContent = '*';
                } else if (board[i][j].adjacentMines > 0) {
                    cell.textContent = board[i][j].adjacentMines;
                }
            } else if (board[i][j].isFlagged) {
                cell.classList.add('flagged');
                cell.textContent = 'F';
            }

            cell.addEventListener('click', handleCellClick);
            cell.addEventListener('contextmenu', handleCellRightClick);
            boardElement.appendChild(cell);
        }
    }
}

function handleCellClick(event) {
    if (gameOver) return;

    const row = parseInt(event.target.dataset.row);
    const col = parseInt(event.target.dataset.col);

    if (board[row][col].isFlagged) return;

    revealCell(row, col);
    checkWinCondition();
}

function handleCellRightClick(event) {
    event.preventDefault();
    if (gameOver) return;

    const row = parseInt(event.target.dataset.row);
    const col = parseInt(event.target.dataset.col);

    if (board[row][col].isRevealed) return;

    board[row][col].isFlagged = !board[row][col].isFlagged;
    renderBoard(board);
}

function revealCell(row, col) {
    if (row < 0 || row >= ROWS || col < 0 || col >= COLS || board[row][col].isRevealed) {
        return;
    }

    board[row][col].isRevealed = true;

    if (board[row][col].isMine) {
        gameOver = true;
        alert('Game Over!');
        revealAllMines();
    } else if (board[row][col].adjacentMines === 0) {
        for (let x = -1; x <= 1; x++) {
            for (let y = -1; y <= 1; y++) {
                revealCell(row + x, col + y);
            }
        }
    }

    renderBoard(board);
}

function revealAllMines() {
    for (let i = 0; i < ROWS; i++) {
        for (let j = 0; j < COLS; j++) {
            if (board[i][j].isMine) {
                board[i][j].isRevealed = true;
            }
        }
    }
    renderBoard(board);
}

function checkWinCondition() {
    let revealedCount = 0;
    for (let i = 0; i < ROWS; i++) {
        for (let j = 0; j < COLS; j++) {
            if (board[i][j].isRevealed) {
                revealedCount++;
            }
        }
    }

    if (revealedCount === ROWS * COLS - MINES) {
        gameOver = true;
        alert('You Win!');
    }
}

restartButton.addEventListener('click', init);

init();
