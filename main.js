function main() {
    const boardUrls = [
        "https://app.ziteboard.com/team/e816af3c-986f-481a-9359-4c5a0977abdd",
        "https://app.ziteboard.com/team/67c22ecb-0fcc-4a13-9912-0dc80682368c",
        "https://app.ziteboard.com/team/9b7fc6ff-ae1e-4ae5-9cb6-52f71ec95dd4",
        "https://app.ziteboard.com/team/24402d39-5bb7-49e3-bcea-82366573948f",
        "https://app.ziteboard.com/team/ce25ca0e-e66e-4f74-b899-8c6f57706d27",
        "https://app.ziteboard.com/team/34059d7b-3c75-4f5a-ba43-27d29aaf15bc"

    ];
    let urlParams = new URLSearchParams(window.location.search);
    Math.seedrandom(urlParams.get("seed"));
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
        if (color !== playerColor) {
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
        let places = [
            [-50, 400], 
            [50, -110],
            [500, -110],
            [950, -110],
            [1050, 400],
        ]
        board.style.left = places[index][0] + "px";
        board.style.top = places[index][1] + "px";
        board.style.transform = "scale(0.62)";
    }
    for (color of allColors) {
        let board = allBoards[color];
        if (color == playerColor) {
            board.style.left = 500 + "px";
            board.style.top = 440 + "px";
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

    let wordTable = document.createElement("table");
    for (let word = 0; word < 7; ++word) {
        let tr = document.createElement("tr");
        for (let card of selectedCards) {
            let td = document.createElement("td");
            td.innerHTML = "<span class='word-number'>" + (word+1) + ".</span>" +
            "<span class='word'>" + card[word] + "</span>";
            tr.appendChild(td);
            
        }
        wordTable.appendChild(tr);
    }
    document.getElementById("game-wrap").appendChild(wordTable);
}

onload = main;