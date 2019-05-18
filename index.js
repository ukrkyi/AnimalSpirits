import {GameTimer} from "./Timer/src";
import {StockMarket} from "./Stocks/src/js/StockMarket";
import {ScoreEvaluation} from "./Evaluation/src/js/ScoreEvaluation";

const button = document.body.querySelector(".Game__StartButton");
let market, timer, evaluation;


document.body.addEventListener('click', ev => {
    if (ev.target.matches('.Game__StartButton')) {
        button.style.display = 'none';
        document.body.querySelector(".Game__name").style.display = 'none';
        market = new StockMarket(["Bear", "Grills", "Cat", "Gopher", "Shit"], document.body.querySelector(".Game__market-container"), Array(5).fill("./Stocks/src/img/50-x-50-icon-28.jpg.png"));
        let timerPlace = document.body.querySelector(".Game__timer-place");
        timer = new GameTimer(timerPlace);
        let stopGame = document.createElement('button');
        stopGame.className = ".Game__EvaluateButton";
        stopGame.innerText = "Stop game and calculate scores";
        stopGame.addEventListener('click', ev =>{
            ev.target.style.display = "none";
            //document.body.querySelector(".Game__market-container").style.display ="none";
            document.body.querySelector(".Game__timer-place").style.display = "none";
            evaluation = new ScoreEvaluation(document.body.querySelector(".Evaluation"), market, [3, 2, 2], Array(5).fill(Array(5).fill("./Evaluation/src/img/icon.png")));
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


