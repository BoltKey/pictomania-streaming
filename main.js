function main() {
    const boardUrls = [
        "https://app.ziteboard.com/team/e816af3c-986f-481a-9359-4c5a0977abdd",
        "https://app.ziteboard.com/team/67c22ecb-0fcc-4a13-9912-0dc80682368c",
        "https://app.ziteboard.com/team/9b7fc6ff-ae1e-4ae5-9cb6-52f71ec95dd4",
        "https://app.ziteboard.com/team/24402d39-5bb7-49e3-bcea-82366573948f",
        "https://app.ziteboard.com/team/ce25ca0e-e66e-4f74-b899-8c6f57706d27",
        "https://app.ziteboard.com/team/34059d7b-3c75-4f5a-ba43-27d29aaf15bc"

    ];
    let scriptUrl = "https://script.google.com/macros/s/AKfycbz1bFUkbyG5uNXw9eL3gG0sMtLrGs45H_aLKdw47mfatv2GwQCtR1dDfunaCiWk95_j/exec";
    let urlParams = new URLSearchParams(window.location.search);
    Math.seedrandom(urlParams.get("seed") + urlParams.get("diff"));
    const allColors = ["green", "pink", "red", "yellow", "blue", "orange"];
    let playerColor = urlParams.get("player");
    let allBoards = {};
    function buttonCallBack(evt) {
        sendVote(playerColor, evt.target.dataset.playerColor, evt.target.dataset.buttonNumber);
        for (e of document.querySelectorAll(
            'button[data-button-number="' + evt.target.dataset.buttonNumber + '"], ' +
            'button[data-player-color="' + evt.target.dataset.playerColor + '"]'
        )) {
            e.setAttribute("disabled", true);
        }

    }
    function sendVote(guesser, guessing, number) {
        console.log("sending vote ", guesser, guessing, number);
        fetch(scriptUrl + "?guesser=" + guesser + "&guessing=" + guessing + "&number=" + number, {
            
            "method": "GET",
            "mode": "no-cors"
        }).then(data => console.log(data))
    }
    for (let i in boardUrls) {
        let url = boardUrls[i];
        let color = allColors[i];
        let frame = document.createElement("iframe");
        frame.setAttribute("width", 600);
        frame.setAttribute("height", 600);
        frame.setAttribute("src", url);
        
        let boardWrap = document.createElement("div");
        boardWrap.classList.add(color, "player-board");
        boardWrap.appendChild(frame);
        if (color !== playerColor && playerColor) {
            let buttonWrap = document.createElement("div");
            buttonWrap.classList.add("button-wrap");
            for (let i = 1; i <= 7; ++i) {
                let button = document.createElement("button");
                button.classList.add(color);
                button.dataset.buttonNumber = i;
                button.dataset.playerColor = color;
                button.addEventListener("click", buttonCallBack);
                button.innerHTML = i;
                buttonWrap.appendChild(button);
            }
            boardWrap.appendChild(buttonWrap);
        }

        allBoards[color] = boardWrap;
        document.getElementById("game-wrap").append(boardWrap);
    }

    let oppBoardIndex = 0;
    function placeBoard(board, index) {
        if (!board) {
            debugger;
        }
        board.style.transform = "scale(0.62)";
        let places = [
            [-50, 400], 
            [50, -110],
            [500, -110],
            [950, -110],
            [1050, 400],
        ]
        if (!playerColor) {
            places = [
                [50, -75],
                [500, -75],
                [950, -75],
                [50, 677], 
                [500, 677],
                [950, 677],
            ]
            board.style.transform = "scale(0.7)";
        }
        board.style.left = places[index][0] + "px";
        board.style.top = places[index][1] + "px";
    }
    for (color of allColors) {
        let board = allBoards[color];
        if (color == playerColor) {
            board.style.left = 500 + "px";
            board.style.top = 440 + "px";
            board.style.zIndex = 5;
            board.style.outlineWidth = "5px";
        }
        else {
            placeBoard(board, oppBoardIndex++);
        }
    }

    let selectedDiff = cards[urlParams.get("diff")];
    let selectedCards = [];
    for (let i = 0; i < 3; ++i) {
        let index = Math.floor(Math.random() * selectedDiff.length);
        selectedCards.push(selectedDiff[index]);
        selectedDiff.splice(index, 1);
    }
    if (!playerColor) {
        let cardList = document.createElement("div");
        cardList.classList.add("card-list")
        let letters = ["A", "B", "C"];
        for (let i in selectedCards) {
            let card = selectedCards[i];
            let table = document.createElement("table");
            let th = document.createElement("th");
            th.innerHTML = letters[i];
            
            table.classList.add("spectator-card", "card-" + urlParams.get("diff"));
            
            for (let row = 0; row < 4; ++row) {
                let tr = document.createElement("tr");
                if (row == 0) {
                    tr.append(th);
                }
                else {
                    tr.append(document.createElement("td"));
                }
                for (let j of [row, row + 4]) {
                    let word = card[j];
                    if (!word) {
                        continue;
                    }
                    let td = document.createElement("td");
                    td.innerHTML = "<span class='word-number'>" + (+j+1) + ". </span>" + 
                    "<span class='word'>" + word + "</span>";
                    tr.appendChild(td);
                }
                
                table.appendChild(tr);
            }
            tr = document.createElement("tr");
            table.appendChild(tr);
            let tableWrap = document.createElement("div");
            tableWrap.classList.add("card-wrap");
            tableWrap.appendChild(table);
            cardList.appendChild(tableWrap);
        }
        document.getElementById("game-wrap").appendChild(cardList);
    }
    else {
        let wordTable = document.createElement("table");
        wordTable.classList.add("word-table")
        let tr = document.createElement("tr");
        for (let letter of ["A", "B", "C"]) {
            let th = document.createElement("th");
            th.innerHTML = letter;
            tr.appendChild(th);
        }
        wordTable.appendChild(tr);
        
        for (let word = 0; word < 7; ++word) {
            let tr = document.createElement("tr");
            for (let card of selectedCards) {
            
                let td = document.createElement("td");
                td.innerHTML = "<span class='word-number'>" + (word+1) + ". </span>" +
                "<span class='word'>" + card[word] + "</span>";
                tr.appendChild(td);
                
            }
            wordTable.appendChild(tr);
        }
        document.getElementById("game-wrap").appendChild(wordTable);
    }
    let allLetters = ["A", "A", "B", "B", "C", "C"];
    let allNumbers = [1, 2, 3, 4, 5, 6, 7];
    function drawRandom(arr) {
        let i = Math.floor(Math.random() * arr.length);
        let result = arr[i];
        arr.splice(i, 1);
        return result;
    }
    let wordsAssigned = {};
    for (let color of allColors) {
        wordsAssigned[color] = {letter: drawRandom(allLetters), n: drawRandom(allNumbers)};
    }
    document.getElementById("assignment").addEventListener("click", revealWord);
    function revealWord(evt) {
        let word = wordsAssigned[playerColor];
        document.getElementById("assignment").innerHTML = word.letter + word.n;
    }

    document.getElementById("finished").addEventListener("click", finished);
    function finished(evt) {
        // TODO: send finished to the sheet
        for (e of document.querySelectorAll("button")) {
            e.setAttribute("disabled", true);
        }
        fetch(scriptUrl + "?guesser=" + playerColor + "&guessing=finished", {
            
            "method": "GET",
            "mode": "no-cors"
        }).then(data => console.log(data))
    }

    
    if (!playerColor) {
        document.getElementById("finished").remove();
        document.getElementById("assignment").remove();
        
    }

}

onload = main;