const createField = (height, width) => {
    return new Array(height * width).fill(0);
};

const generateCards = (x, y) => {
    let field = createField(5, 5);
    return field.map((ev, i) => field[i] = [Math.floor(i / x), i % y]);
}


class Area {
    constructor(container, x, y) {
        this.model = generateCards(x, y);
        this.container = container;
        this.clicked = {};
        this.render();
        this.initHandlers();
    }

    static renderCards(cards) {
        return cards.map(card => `<div class="card">${card || ''}</div>`).join('')
    }

    getClicked() {
        console.log(this.clicked);
        for (let key in this.clicked) {
            console.log(key + " - " + this.clicked[key]);
        }
    }

    initHandlers() {
        this.container.addEventListener('click', ev => {
            if (ev.target.matches('.card')) {
                if (this.clicked[ev.target.innerText]) {
                    this.clicked[ev.target.innerText]++;
                } else {
                    this.clicked[ev.target.innerText] = 1;
                }
            }

            if (ev.target.matches('.evaluate')) {
                this.getClicked();
                alert("Check console");
                this.clicked = {};
            }
        })
    }

    render() {
        this.container.innerHTML = `
      <div class="cards">
        ${Area.renderCards(this.model)}
        <br>
        <button class="evaluate">Evaluate</button>
      </div>
  `
    }
}

const area = new Area(document.body.getElementsByTagName('section')[0], 5, 5);
