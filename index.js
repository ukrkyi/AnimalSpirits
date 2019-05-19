import {GameTimer} from "./Timer/src";
import {StockMarket} from "./Stocks/src/js/StockMarket";
import {ScoreEvaluation} from "./Evaluation/src/js/ScoreEvaluation";

const button = document.body.querySelector(".Game__StartButton");
let market, timer, evaluation;


document.body.addEventListener('click', ev => {
    if (ev.target.matches('.Game__StartButton')) {
        button.style.display = 'none';
        document.body.querySelector(".Game__name").style.display = 'none';
        market = new StockMarket(["Кінь", "Ведмідь", "Вівця", "Кабан", "Бик"], document.body.querySelector(".Game__market-container"),
            Array.from({length: 4}, (_, i) => "./Evaluation/src/img/row-" + (i+1) + "-col-1.png").
        concat(["./Evaluation/src/img/icon.png"]));
        let timerPlace = document.body.querySelector(".Game__timer-place");
        timer = new GameTimer(timerPlace);
        let stopGame = document.createElement('button');
        stopGame.className = ".Game__EvaluateButton";
        stopGame.innerText = "Stop game and calculate scores";
        stopGame.addEventListener('click', ev =>{
            ev.target.style.display = "none";
            //document.body.querySelector(".Game__market-container").style.display ="none";
            document.body.querySelector(".Game__timer-place").style.display = "none";
            evaluation = new ScoreEvaluation(document.body.querySelector(".Evaluation"), market, [5, 4, 3],
                Array.from({length: 4}, (_, i) =>
                    Array.from({length: 5}, (_, j) => "./Evaluation/src/img/row-" + (i+1) + "-col-" + (j+1) + ".png"))
                    .concat([Array(5).fill("./Evaluation/src/img/icon.png")]));
        });
        timerPlace.parentNode.insertBefore(stopGame, timerPlace.nextSibling);
        console.log(market.getPrices());
    }

/*    if (ev.target.matches(".Game__EvaluateButton")) {
        console.log ("ev caught");
        document.body.querySelector(".Game__market-container").style.display ="none";
        document.body.querySelector(".Game__timer-place").style.display = "none";
        evaluation = new ScoreEvaluation(document.body.querySelector(".Evaluation"), Array(5).fill(Array(5).fill("./Evaluation/src/img/icon.png")));
    }*/

});


