let Timer = require("easytimer.js");

function htmlToElement(html) {
    let element = document.createElement('div');
    element.innerHTML = html;
    return element.firstChild;
}

class GameTimer {
    constructor(container) {
        this.current_market_waits = true;
        this.waitForMarket = 0.1;
        this.marketTime = 0.05;
        this.container = container;
        this.render();
        this.timer = null;
        this.timerSound = new Audio("../../sounds/beep-01a.mp3");
        console.log("Timer initialized");
        this.initHandlers();
    }

    render() {
        this.container.appendChild(htmlToElement(`<div class="Game__timer-place">
            <span class="Timer__time">
            Waiting for you to click
            </span>
            <button class="Timer__start">
            Wait for market
            </button>
        </div>`));
    }

    setTime(value) {
        this.container.getElementsByClassName("Timer__time")[0].innerHTML = value.toString();
    }

    setCurrentTime() {
        this.setTime(this.timer.getTimeValues());
    }

    startTimer(timeMinutes) {
        this.timer = new Timer.Timer();
        this.timer.start({countdown: true, startValues: {seconds: timeMinutes * 60}});
        this.setCurrentTime();
        this.timer.addEventListener('secondsUpdated', this.setCurrentTime.bind(this));
        this.container.querySelector(".Timer__start").style.display = 'none';
        this.timer.addEventListener('targetAchieved', ev => {
            this.timerSound.play.bind(this.timerSound);
            if (this.current_market_waits) {
                this.setTime("Bidding Time!!!");
                this.container.getElementsByClassName("Timer__start")[0].innerHTML = "Start market bidding";
            } else {
                this.setTime("You have to wait until market opens");
                this.container.getElementsByClassName("Timer__start")[0].innerHTML = "Wait for market";
            }
            this.container.querySelector(".Timer__start").style.display = null;
            this.current_market_waits = !this.current_market_waits;
        });
    }

    stopTimer() {
        this.timerSound.play();
        this.setTime("00:00:00");
    }

    initHandlers() {
        this.container.addEventListener('click', ev => {
            if (ev.target.matches('.Timer__start')) {
                if (this.current_market_waits) {
                    this.startTimer(this.waitForMarket);
                } else {
                    this.startTimer(this.marketTime);
                }
            }
        })
    }
}

export {GameTimer};
