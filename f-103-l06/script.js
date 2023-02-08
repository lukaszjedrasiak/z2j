//board has to be square
const BOARDSIZE = 3;

//empty array must have BOARDSIZE×BOARDSIZE size
const boardMemory = [
    ["","",""],
    ["","",""],
    ["","",""]
]

function printSign(y, x, sign) {
    let cell = document.querySelector(`[data-axey="${y}"][data-axex="${x}"]`)
    if (sign === 1) {
        cell.textContent = "×";
    } else {
        cell.textContent = "○";
    }
}

function saveSign(y, x, sign) {
    boardMemory[y][x] = sign;
}

function movePlayer(y, x, sign) {
    printSign(y, x, sign);
    saveSign(y, x, sign);
}

function moveComp(sign) {
    const buffer = [];
    for (let i = 0; i < BOARDSIZE; i++) {
        for (let j = 0; j < BOARDSIZE; j++) {
            if (boardMemory[i][j] === "") {
                buffer.push([i, j])
            }
        }
    }

    if (buffer.length > 0) {
        const field = Math.floor(Math.random() * buffer.length);
        const y = buffer[field][0];
        const x = buffer[field][1];
        printSign(y, x, sign);
        saveSign(y, x, sign);
    }
}

function checkWinner(sign) {
    let buffer = [];

    //check horizontally
    for (let i = 0; i < BOARDSIZE; i++) {
        buffer = boardMemory[i];
        if (buffer.every(item => item === sign)) return true;
    }

    //check vertically
    for (let i = 0; i < BOARDSIZE; i++) {
        buffer = [];
        for (let j = 0; j < boardMemory[i].length; j++) {
            let value = boardMemory[j][i];
            buffer.push(value);
        }
        if (buffer.every(item => item === sign)) return true;
    }

    //check diagonally
    buffer = [];
    for (let i = 0; i < BOARDSIZE; i++) {
        buffer.push(boardMemory[i][i]);
    }
    if (buffer.every(item => item === sign)) return true;

    buffer = [];
    for (let i = 0; i < BOARDSIZE; i++) {
        buffer.push(boardMemory.at(-1-i)[i]);
    }
    if (buffer.every(item => item === sign)) return true;
}

function checkTie() {
    const buffer = [];
    for (let i = 0; i < BOARDSIZE; i++) {
        for (let j = 0; j < BOARDSIZE; j++) {
            buffer.push(boardMemory[i][j]);
        }
    }
    if (buffer.every(item => (item !== "") && (item !== "_" ) )) {
        return true;
    }
}

function fillBoard() {
    for (let i = 0; i < BOARDSIZE; i++) {
        for (let j = 0; j < BOARDSIZE; j++) {
            boardMemory[i][j] = "_";
        }
    }
}

function printMessage(text) {
    const area = document.querySelector(".messages");
    area.innerHTML = `<p>${text}</p>`;
}

function addPlayButton(text) {
    const playButton = document.createElement("button");
    playButton.textContent = text;
    playButton.setAttribute("id", "btnPlay")
    document.querySelector(".buttons").append(playButton);
    playButton.addEventListener('click', () => {
        location.reload();
    });
}

function playGame() {
    if (Math.round(Math.random())) {
        moveComp(0);
    }

    const board = document.querySelector('#board');
    board.addEventListener('click', event => {
        if (event.target.classList.contains('cell')) {
            const y = event.target.dataset.axey;
            const x = event.target.dataset.axex;
            if (boardMemory[y][x] === "") {
                movePlayer(y, x, 1);
                if (checkWinner(1)) {
                    fillBoard();
                    printMessage('Player won!');
                    addPlayButton('Play again');
                }
                if (checkTie()) {
                    printMessage('Tie!');
                    addPlayButton('Play again');
                }
                moveComp(0);
                if (checkWinner(0)) {
                    fillBoard();
                    printMessage('Computer won!')
                    addPlayButton('Play again');
                }
                if (checkTie()) {
                    printMessage('Tie!');
                    addPlayButton('Play again');
                }
            }
        }
    })
}

playGame();