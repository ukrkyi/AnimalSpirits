import {GameTimer} from "./Timer/src";
import {StockMarket} from "./Stocks/src/js/StockMarket";

const button = document.body.querySelector(".Game__StartButton");
let market, timer;


document.body.addEventListener('click', ev => {
    if (ev.target.matches('.Game__StartButton')) {
        button.style.display = 'none';
        document.body.querySelector(".Game__name").style.display = 'none';
        market = new StockMarket(["Bear", "Grills"], document.body.querySelector(".Game__market-container"), ["./Stocks/src/img/50-x-50-icon-28.jpg.png",
            "./Stocks/src/img/50-x-50-icon-28.jpg.png"]);
        timer = new GameTimer(document.body.querySelector(".Game__timer-place"));
        console.log(document.body.querySelector(".Timer").style);
    }
});


