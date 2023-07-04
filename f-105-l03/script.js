function getInitialDifficulty() {
    const level = localStorage.getItem("minesweeperGameLevel");
    return (level ? level : "easy");
}

function buildBoard(difficultyLevel) {
    let xCount = 0;
    let yCount = 0;
    let mines = 0;
    switch (difficultyLevel) {
        case "easy":
            xCount = 8;
            yCount = 8;
            mines = 10;
            break;
        case "medium":
            xCount = 16;
            yCount = 16;
            mines = 40;
            break;
        case "hard":
            xCount = 30;
            yCount = 16;
            mines = 99;
            break;
    }
    
    // build board grid
    const boardGrid = document.querySelector('#boardGrid');
    boardGrid.style.gridTemplateColumns = `repeat(${xCount}, 1fr)`

    // clear any children from board
    while (boardGrid.firstChild) {
        boardGrid.removeChild(boardGrid.firstChild);
    }

    // add the fields
    /*
    for (let i = 0; i < xCount * yCount; i++) {
        const boardField = document.createElement('div');
        boardGrid.appendChild(boardField);
    }
    */

    let cellIndex = 0;
    for (let y = 0; y < yCount; y++) {
        for (let x = 0; x < xCount; x++) {
            const boardField = document.createElement('div');
            boardField.dataset.y = y; // setting data-y attribute
            boardField.dataset.x = x; // setting data-x attribute
            boardGrid.appendChild(boardField);
            cellIndex++;
        }
    }

    //build gameBoard object
    let board = {
        arr: new Array(yCount).fill(null).map(() => new Array(xCount).fill(null).map(() => ({
            mine: false, 
            revealed: false,
            flaged: false,
            questioned: false,
        }))),
        mines: mines,
        x: xCount,
        y: yCount,
        gameOver: false,
        timerOn: false,
    }
    return board;

}

function fillBoardWithMines(board) {
    let i = 0;
    
    while (i < board.mines) {
        let y = Math.floor(Math.random() * board.y);
        let x = Math.floor(Math.random() * board.x);
        //console.log(`mine: ${y} / ${x} / ${board.arr[y][x].mine}`);
        
        if (board.arr[y][x].mine === false) {
            board.arr[y][x].mine = true;
            i++;
        }
        
    }
    
    return board;
}

function fillBoardWithCounters(board) {

    const directions = [
        [-1, -1], [-1, 0], [-1, 1],
        [0, -1], /*self*/ [0, 1],
        [1, -1], [1, 0], [1, 1]
    ];

    for (let y = 0; y < board.y; y++) {
        for (let x = 0; x < board.x; x++) {
            // If this cell is not a mine
            if (!board.arr[y][x].mine) {
                let mineCount = 0;
                
                // Check each of the 8 neighboring cells
                for (let [dx, dy] of directions) {
                    let newY = y + dy;
                    let newX = x + dx;
                    
                    // Check if this cell is within the board and is a mine
                    if (newY >= 0 && newY < board.y && newX >= 0 && newX < board.x && board.arr[newY][newX].mine) {
                        mineCount++;
                    }
                }
                
                // Set the 'counter' property
                board.arr[y][x].counter = mineCount;
            }
        }
    }
    
    return board;
}

function populateGrid(board, boardGrid) {
    // Get all the div elements representing the cells in the grid
    const boardFields = boardGrid.querySelectorAll('div');

    // Iterate over all divs
    for (let boardField of boardFields) {
        // Get the 'x' and 'y' data attributes
        let y = parseInt(boardField.dataset.y);
        let x = parseInt(boardField.dataset.x);

        // Get the corresponding cell
        let cell = board.arr[y][x];

        // Set the text of the div based on the properties of the cell
        if (cell.mine) {
            boardField.innerText = '*';
        } else {
            boardField.innerText = cell.counter.toString();
        }
    }
}

function revealNeighbors(y, x, board, boardGrid) {
    // Define the possible offsets for neighbors in the 2D grid
    const neighbors = [
        [-1, -1], [-1, 0], [-1, 1],  // top-left, top-middle, top-right
        [0, -1],           [0, 1],   // middle-left,         middle-right
        [1, -1], [1, 0], [1, 1]     // bottom-left, bottom-middle, bottom-right
    ];

    // Go through each neighbor
    for (const [dy, dx] of neighbors) {
        const newY = y + dy;
        const newX = x + dx;

        // Check if neighbor is within grid boundaries
        if (newY >= 0 && newY < board.y && newX >= 0 && newX < board.x) {
            const neighbor = board.arr[newY][newX];

            if (!neighbor.mine && !neighbor.revealed && !neighbor.flaged) {
                neighbor.revealed = true;

                const neighborField = boardGrid.querySelector(`div[data-y='${newY}'][data-x='${newX}']`);
                if (neighbor.counter > 0) {
                    switch (neighbor.counter) {
                        case 1:
                            neighborField.classList.add("blue");
                            break;
                        case 2:
                            neighborField.classList.add("green");
                            break;
                        case 3:
                            neighborField.classList.add("red");
                            break;
                        case 4:
                            neighborField.classList.add("darkblue");
                            break;
                        case 5:
                            neighborField.classList.add("brown");
                            break;
                    }
                    neighborField.innerText = neighbor.counter.toString();
                } else {
                    neighborField.innerText = "";
                    revealNeighbors(newY, newX, board, boardGrid);
                }

                neighborField.classList.add("revealed");
            }
        }
    }
}

function addEventListeners(board, boardGrid) {
    const boardFields = boardGrid.querySelectorAll('div');
    let intervalID;

    for (let boardField of boardFields) {
        let y = parseInt(boardField.dataset.y);
        let x = parseInt(boardField.dataset.x);
        let cell = board.arr[y][x];

        const handleClick = (event) => {

            // If the game is over, don't handle any clicks
            if (board.gameOver) {
                return;
            }

            if (!board.timerOn) {
                board.timerOn = true;
                Timer(board);
            }

            if (!cell.flaged) {
                //console.log(`LMB y: ${y} / x: ${x}`);
                boardField.classList.add("revealed");

                if (cell.mine) {
                    boardField.classList.add("mine");
                    boardField.style.backgroundColor = "red";
                    // Game over, set the flag
                    board.gameOver = true;
                    
                    //stop the timer
                    for (let id of intervalIDs) {
                        clearInterval(id);
                    }
                    intervalIDs = [];

                    //change face
                    document.querySelector("#start").classList.remove("happy");
                    document.querySelector("#start").classList.add("sad");

                    // Loop over all the cells in the board array
                    for (let i = 0; i < board.y; i++) {
                        for (let j = 0; j < board.x; j++) {
                            let currentCell = board.arr[i][j];
                            // If a cell has a mine but is not flagged, reveal it
                            if (currentCell.mine && !currentCell.flaged) {
                                let currentField = boardGrid.querySelector(`div[data-y='${i}'][data-x='${j}']`);
                                currentField.classList.add("mine");
                                currentField.classList.add("revealed");
                            }
                        }
                    }

                } else if (cell.counter === 0) {
                    board.innerText = "";
                    cell.revealed = true; // mark cell as revealed
                    revealNeighbors(y, x, board, boardGrid); // recursively reveal neighbors
                } else {
                    switch (cell.counter) {
                        case 1:
                            boardField.classList.add("blue");
                            break;
                        case 2:
                            boardField.classList.add("green");
                            break;
                        case 3:
                            boardField.classList.add("red");
                            break;
                        case 4:
                            boardField.classList.add("darkblue");
                            break;
                        case 5:
                            boardField.classList.add("brown");
                            break;
                    }
                    boardField.innerText = cell.counter.toString();
                    cell.revealed = true; // mark cell as revealed
                }
            }
            checkWin(board);
        }

        boardField.addEventListener('click', handleClick);

        boardField.addEventListener('contextmenu', (event) => {
            
            // If the game is over, don't handle any clicks
            if (board.gameOver) {
                return;
            }
            
            event.preventDefault();
            //console.log(`RMB y: ${y} / x: ${x}`);
            if (board.mines > 0 && !cell.flaged && !cell.revealed && !cell.questioned) {
                cell.flaged = true;
                boardField.classList.add("flag");
                board.mines--;
                updateMinesCounter(board);
            } else if (cell.flaged) {
                cell.flaged = false;
                cell.questioned = true;
                boardField.innerText = "?";
                boardField.classList.remove("flag");
                board.mines++;
                updateMinesCounter(board);
            } else if (cell.questioned) {
                cell.flaged = false;
                cell.questioned = false;
                boardField.innerText = "";
            }
            checkWin(board);
        })
    }
}

function updateMinesCounter(board) {
    let counter = board.mines;
    let counterPlaceholder = document.querySelector("#mineCounter");
    counterPlaceholder.innerText = counter.toString().padStart(3, '0');
}

function checkWin(board) {
    console.log("check win");
    let revealedCounter = 0;
    let flagedCounter = 0;
    let boardSize = (board.x) * (board.y);

    for (let y = 0; y < board.y; y++) {
        for (let x = 0; x < board.x; x++) {
            if (board.arr[y][x].revealed) {
                revealedCounter++;
            } else if (board.arr[y][x].flaged) {
                flagedCounter++;
            }
        }
    }
    
    if ((board.mines === 0) && (revealedCounter + flagedCounter === boardSize)) {
            /*
            document.querySelector("#start").classList.remove("happy");
            document.querySelector("#start").classList.add("glasses");
            console.log("changed class");
            */
        const time = parseInt(document.querySelector("#timer").innerText);
        let winnersList = JSON.parse(localStorage.getItem("winnersList"));
        let winnerObj = winnersList.filter(winner => winner.level === gameLevel);
        console.log(`saved time: ${winnerObj[0].time}`);
        console.log(`current time: ${time}`);
        
        if (winnerObj[0].time > time) {
            setTimeout(() => {
                let winnerName = prompt("You won!\nEnter your name:");
                if (winnerName) {
                    const newWinnersList = winnersList.map(item => {
                        if (item.level === gameLevel) {
                            item.name = winnerName;
                            item.time = time;
                            return item;
                        } else {
                            return item;
                        }
                    });
                    localStorage.removeItem("winnersList");
                    localStorage.setItem("winnersList", JSON.stringify(newWinnersList));
                }
            });
            console.log('new winner');

        } else {
            alert('You won!');
        }
        
        location.reload(); 
        
    }
}

function Timer(board) {
    let intervalID;
    if (board.timerOn) {
        let counter = 0;
        let counterPlaceholder = document.querySelector("#timer");
        intervalID = setInterval(() => {
            counter++;
            counterPlaceholder.innerText = counter.toString().padStart(3, '0');
        }, 1000);
        intervalIDs.push(intervalID);
    }
}

function stopTimer() {
    for (let id of intervalIDs) {
        clearInterval(id);
    }
    intervalIDs = [];
    document.querySelector("#timer").innerText = "000";
}

/*
/* MAIN LOOP
*/

// initialize
console.log("script loaded");
document.querySelector("#board").style.cursor = "default";
let intervalIDs = [];

// get difficulty and paint initial board
let gameLevel = getInitialDifficulty();
let gameBoard = buildBoard(gameLevel);
let boardGrid = document.querySelector("#boardGrid");

gameBoard = fillBoardWithMines(gameBoard);
gameBoard = fillBoardWithCounters(gameBoard);
updateMinesCounter(gameBoard);
addEventListeners(gameBoard, boardGrid);

// listen for difficulty change
let listItems = document.querySelectorAll('#dropdown ul li');
    // Loop through the list items and attach a click event listener
    for(let item of listItems){
        item.addEventListener('click', function(event) {
            stopTimer();
            selectedDifficulty = event.target.textContent.toLowerCase();
            localStorage.setItem("minesweeperGameLevel", selectedDifficulty);
            gameLevel = selectedDifficulty;
            gameBoard = buildBoard(gameLevel);
            gameBoard = fillBoardWithMines(gameBoard);
            gameBoard = fillBoardWithCounters(gameBoard);
            updateMinesCounter(gameBoard);
            addEventListeners(gameBoard, boardGrid);
        });
    }

//sample winnerList
const sampleWinnersList = [
    {level: "easy",
    name: "Anonymous",
    time: 999,
    },
    {level: "medium",
    name: "Anonymous",
    time: 999,
    },
    {
    level: "hard",
    name: "Anonymous",
    time: 999,
    },
];
if (!localStorage.getItem("winnersList")) {
    localStorage.setItem("winnersList", JSON.stringify(sampleWinnersList));
}

// listen for winners click
let winners = document.querySelector("#winners");
let winnersList = JSON.parse(localStorage.getItem("winnersList"));


winners.addEventListener('click', () => {
    if (winnersList) {
        let winnerObj = winnersList.filter(winner => winner.level === gameLevel);
        let winnersString = `Best result for ${gameLevel} level\n`;
        winnersString += `${winnerObj[0].name} | ${winnerObj[0].time}`;
        alert(winnersString);
    } else {
        alert("No winners yet")
    }
})

//start game
let btn_start = document.querySelector("#start");
btn_start.addEventListener("click", () => {
    document.querySelector("#start").classList.remove("sad");
    document.querySelector("#start").classList.add("happy");
    stopTimer();
    gameBoard = buildBoard(gameLevel);
    gameBoard = fillBoardWithMines(gameBoard);
    gameBoard = fillBoardWithCounters(gameBoard);
    updateMinesCounter(gameBoard);
    addEventListeners(gameBoard, boardGrid);
});
