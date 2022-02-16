function main() {
    const boardUrls = [
        "https://app.ziteboard.com/team/7e7f39d4-f6ca-40d6-8756-d4ea7332ab77",
        "https://app.ziteboard.com/team/5f176c62-3a42-468a-985d-691ea7f5b61c",
        "https://app.ziteboard.com/team/af84f3d9-8754-4829-b7fd-d994da91d19d",
        "https://app.ziteboard.com/team/24402d39-5bb7-49e3-bcea-82366573948f",
        "https://app.ziteboard.com/team/ce25ca0e-e66e-4f74-b899-8c6f57706d27",
        "https://app.ziteboard.com/team/34059d7b-3c75-4f5a-ba43-27d29aaf15bc"

    ];
    let scriptUrl = "https://script.google.com/macros/s/AKfycbz1bFUkbyG5uNXw9eL3gG0sMtLrGs45H_aLKdw47mfatv2GwQCtR1dDfunaCiWk95_j/exec";
    let urlParams = new URLSearchParams(window.location.search);
    
    const allColors = ["green", "pink", "red", "yellow", "blue", "orange"];
    let playerColor;
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
        fetch(scriptUrl + "?guesser=" + guesser + "&guessing=" + guessing + "&number=" + number + "&playerCorrect=" + wordsAssigned[guesser].n, {
            
            "method": "GET",
            "mode": "no-cors"
        }).then(data => console.log(data))
    }
    
    
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
        if (!playerColor || playerColor == "spectator") {
            places = [
                [50, -65],
                [500, -65],
                [950, -65],
                [50, 677], 
                [500, 677],
                [950, 677],
            ]
            board.style.transform = "scale(0.7)";
            board.classList.add("spectator");
        }
        board.style.left = places[index][0] + "px";
        board.style.top = places[index][1] + "px";
    }
    function setupBoards() {
        let allBoards = {};

        for (let e of document.querySelectorAll(".player-board")) {
            e.remove();
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
        for (color of allColors) {
            let board = allBoards[color];
            if (color == playerColor) {
                board.style.left = 500 + "px";
                board.style.top = 440 + "px";
                board.style.zIndex = 5;
                board.style.outlineWidth = "5px";
                board.style.transform = "scale(1)";
            }
            else {
                placeBoard(board, oppBoardIndex++);
            }
        }
    }
    let wordsAssigned;
    function colorPicked(color) {
        playerColor = color;
        setupBoards();
        setupWords();
        document.getElementById("finished").classList.remove("hidden");
        document.getElementById("assignment").classList.remove("hidden");
        if (!playerColor || playerColor == "spectator") {
            document.getElementById("finished").classList.add("hidden");
            document.getElementById("assignment").classList.add("hidden");
        }
        assignCards();
    }
    function diffSelected(diff) {
        selectedDiff = diff;
        setupWords();
        assignCards();
    }
    let selectedDiff;
    diffSelected("easy");
    function colorSelectCallback(evt) {
        colorPicked(evt.target.value);
    }
    function diffSelectCallback(evt) {
        diffSelected(evt.target.value);
    }
    
    function setupWords() {
        for (let e of document.querySelectorAll(".card-wrap, .word-table")) {
            e.remove();
        }
        let diffCards = cards[selectedDiff]
        Math.seedrandom(urlParams.get("seed") + selectedDiff);
        let selectedCards = [];
        for (let i = 0; i < 3; ++i) {
            let index;
            do {
                index = Math.floor(Math.random() * diffCards.length);
            } while (selectedCards.includes(diffCards[index]));
            selectedCards.push(diffCards[index]);
            
        }
        if (!playerColor || playerColor == "spectator") {
            let cardList = document.createElement("div");
            cardList.classList.add("card-list")
            let letters = ["A", "B", "C"];
            for (let i in selectedCards) {
                let card = selectedCards[i];
                let table = document.createElement("table");
                let th = document.createElement("th");
                th.innerHTML = letters[i];
                
                table.classList.add("spectator-card", "card-" + selectedDiff);
                
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
                        td.innerHTML = "<span class='word-number'>" + (+j+1) + ".&nbsp</span>" + 
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
    }
    function assignCards() {
        let allLetters = ["A", "A", "B", "B", "C", "C"];
        let allNumbers = [1, 2, 3, 4, 5, 6, 7];
        function drawRandom(arr) {
            let i = Math.floor(Math.random() * arr.length);
            let result = arr[i];
            arr.splice(i, 1);
            return result;
        }
        wordsAssigned = {};
        for (let color of allColors) {
            wordsAssigned[color] = {letter: drawRandom(allLetters), n: drawRandom(allNumbers)};
        }
        let theDiv = document.getElementById("assignment");
        theDiv.addEventListener("click", revealWord);
        theDiv.innerHTML = "Click to reveal your cards"
        function revealWord(evt) {
            let word = wordsAssigned[playerColor];
            document.getElementById("assignment").innerHTML = word.letter + word.n;
        }
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

    document.getElementById("select-color").addEventListener("change", colorSelectCallback);
    document.getElementById("select-diff").addEventListener("change", diffSelectCallback);

    colorPicked();
    
}

onload = main;