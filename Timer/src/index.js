let Timer = require("easytimer.js");

function htmlToElement(html) {
    let element = document.createElement('div');
    element.innerHTML = html;
    return element.firstChild;
}

class GameTimer {
    constructor(container) {
        this.waitForMarket = 6;
        this.marketTime = 3;
        this.container = container;
        this.render();
        this.timer = null;
        this.timerSound = new Audio("../../sounds/beep-01a.mp3");
    }

    render() {
        this.container.appendChild(htmlToElement(`<div class="Game__timer-place">
            <span class="Timer__time">
            Waiting for you to click
            </span>
        </div>`));
    }

    setTime(value) {
        this.container.getElementsByClassName("Timer__time")[0].innerHTML = value.toString();
    }

    setCurrentTime() {
        this.setTime(this.timer.getTimeValues());
    }

    async startTimer(market) {
        this.timer = new Timer.Timer();
        this.timer.addEventListener('secondsUpdated', this.setCurrentTime.bind(this));
        let pr = new Promise((resolve, reject) => {
            this.timer.addEventListener('targetAchieved', ev => {
                this.timerSound.play.bind(this.timerSound);
                resolve(!market);
            });
        });
        this.timer.start({countdown: true, startValues: {seconds: market ? this.waitForMarket : this.marketTime}});
        this.setCurrentTime();
        return pr;
    }

    stopTimer() {
        this.timerSound.play.bind(this.timerSound);
        this.setTime("00:00:00");
    }
}

export {GameTimer};
