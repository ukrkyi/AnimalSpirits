import {GameTimer} from "./Timer/src";
import {StockMarket} from "./Stocks/src/js/StockMarket";
import {ScoreEvaluation} from "./Evaluation/src/js/ScoreEvaluation";

let market, timer, evaluation;

function generateStopButton() {
    let stopGame = document.createElement('button');
    stopGame.className = ".Game__EvaluateButton";
    stopGame.innerText = "Stop game and calculate scores";
    stopGame.addEventListener('click', ev => {
        ev.target.style.display = "none";
        //document.body.querySelector(".Game__market-container").style.display ="none";
        document.body.querySelector(".Game__timer-place").style.display = "none";
        evaluation = new ScoreEvaluation(document.body.querySelector(".Evaluation"), market, [5, 3, 3, 2],
            Array.from({length: 4}, (_, i) =>
                Array.from({length: 5}, (_, j) => "./Evaluation/src/img/row-" + (i + 1) + "-col-" + (j + 1) + ".png"))
                .concat([Array(5).fill("./Evaluation/src/img/icon.png")]));
    });
    return stopGame;
}

document.body.querySelector(".Game__StartButton").addEventListener('click', ev => {
    document.body.querySelector(".Game__StartButton").style.display = 'none';
    document.body.querySelector(".Game__name").style.display = 'none';
    gameProcess();
});

async function waitButtons(button_next, button_finish) {
    return new Promise(resolve => {
        function clicked_next() {
            clicked(true);
        }

        function clicked_finish() {
            clicked(false);
        }

        function clicked(res) {
            button_next.removeEventListener("click", clicked_next);
            button_finish.removeEventListener("click", clicked_finish);
            resolve(res);
        }

        button_next.addEventListener("click", clicked_next);
        button_finish.addEventListener("click", clicked_finish);
    });
}

function hide(...els) {
    els.forEach(el => el.style.display = "none");
}

function show(what, ...els) {
    els.forEach(el => el.style.display = what);
}

const get_location = () => (window.location.hostname);
const get_cards_names = async () => {
    let cards_lst = await (await fetch(`http://${get_location()}:5000/card_types/`)).json();
    return cards_lst;
};
const post_config = (data) => ({
    method: 'POST',
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
    },
    body: JSON.stringify(data)
});
const create_game = async () => {
    const data = {rounds: 1};
    return await (await fetch(`http://${get_location()}:5000/games/`, post_config(data))).json();
};

let id = 0;
let round = 1;

async function gameProcess() {
    const names = await get_cards_names();
    console.log(names);
    market = new StockMarket(
        names,
        document.body.querySelector(".Game__market-container"),
        Array.from({length: 4}, (_, i) => "./Evaluation/src/img/row-" + (i + 1) + "-col-1.png").concat(["./Evaluation/src/img/icon.png"]));
    let timerPlace = document.body.querySelector(".Game__timer-place");
    timer = new GameTimer(timerPlace);
    let button = document.body.querySelector(".Game__Process-next_step");
    let finButton = document.body.querySelector(".Game__Process-finish");
    let waitMarket = true;
    let next_step = true;
    do {
        if (!waitMarket) {
            timer.setTime("Market opens!");
            button.innerText = "Start bidding";
        } else {
            timer.stopTimer();
            button.innerText = "Wait for market";
        }
        show("block", button);
        if (!waitMarket)
            show("block", finButton);
        next_step = await waitButtons(button, finButton);
        hide(button, finButton);
        if (next_step) {
            waitMarket = await timer.startTimer(waitMarket);
        }
    } while (next_step);
    hide(timerPlace);
    let gameInfo = document.body.querySelector(".Game__Process-info");
    gameInfo.innerText = "Waiting for server response...";
    show("block", gameInfo);
    let gameCreated = await create_game();
    id = gameCreated["id"];
    let waiter = Array(5);
    for (let i = 1; i <= 5; i++) {
        waiter[i] = fetch(`http://${get_location()}:5000/prices/`, {
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                game_id: id,
                type_id: i,
                round: 1,
                price: market.prices[i - 1][1],
            }),
            method: "POST"
        });
    }
    await Promise.all(waiter);
    gameInfo.innerText = "Your PIN is " + gameCreated["id"];
    // TODO display results
}

window.addEventListener('beforeunload', async (event) => {
    if (id !== 0) {
        await fetch(`http://${get_location()}:5000/games/${id}`, {method: "DELETE"});
    }

    // Chrome requires returnValue to be set.
    event.returnValue = undefined;
});
