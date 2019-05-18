export class ScoreEvaluation {
    constructor(container, market, coeffs, images) {
        this.container = container;
        this.data = images.map(img_arr => img_arr.map(img => ({image: img, counter: 0})));
        this.market = market;
        this.coeffs = coeffs;
        this.render();
        this.initHandlers();
    }

    renderCards() {
        return this.data.map(
            (data_array, i) => data_array.map(
                (element, j) => `<div class="Evaluation__card" data-row="${i}" data-column="${j}">
<img class="Evaluation__card-image" src="${element.image}" />
<button class="Evaluation__card-button">-</button>
<div class="Evaluation__card-count">${element.counter}</div>
<button class="Evaluation__card-button">+</button></div>`)
                .join(''))
            .join('')
    }

    render() {
        this.container.innerHTML = `
        ${this.renderCards()}
      <button class="Evaluation__button">Evaluate</button>
  `
    }

    initHandlers() {
        this.container.addEventListener('click', ev => {
            if (ev.target.matches('.Evaluation__card-button')) {
                let container = ev.target.parentElement;
                let row = Number(container.getAttribute("data-row"));
                let col = Number(container.getAttribute("data-column"));
                let el = this.data[row][col];
                if (ev.target.innerText==="+" && el.counter < 5) {
                    el.counter++;
                } else if (ev.target.innerText==="-" && el.counter > 0) {
                    el.counter--;
                }
                container.getElementsByClassName("Evaluation__card-count")[0].innerHTML = el.counter;
            }

            if (ev.target.matches(".Evaluation__button")) {
                alert(this.getCount(this.market.getPrices()).toFixed(1));
            }
        })
    }

    calc_rest(matrix, prices) {
        let n = this.data.length;
        let flat = matrix.flat();
        let max_sum = flat.reduce((sum, el, index) => sum + el * prices[Math.floor(index / n)], 0);
        let ind = flat.indexOf(n);
        if (ind !== -1) {
            let animal = Math.floor(ind / n);
            matrix[animal][ind % n] -= n;
            let sum = n * prices[animal] * this.coeffs[0] + this.calc_rest(matrix, prices);
            matrix[animal][ind % n] += n;
            if (sum > max_sum)
                max_sum = sum;
        }
        ind = matrix.findIndex(row => row.every(el => el > 0));
        if (ind !== -1) {
            matrix[ind] = matrix[ind].map(el => el - 1);
            let sum = n * prices[ind] * this.coeffs[1] + this.calc_rest(matrix, prices);
            matrix[ind] = matrix[ind].map(el => el + 1);
            if (sum > max_sum)
                max_sum = sum;
        }
        let reduction = matrix.reduce((acc, array) => acc.map((el, index) => (el && array[index] > 0)),Array(n).fill(true));
        ind = reduction.indexOf(true);
        if (ind !== -1) {
            let sum = prices.reduce((sum, el) => sum + el * this.coeffs[2], 0) + this.calc_rest(matrix.map(row => row.map((el, cur) => (cur === ind ? el - 1 : el))), prices);
            if (sum > max_sum)
                max_sum = sum;
        }
        return max_sum;
    }

    getCount(prices) {
        return this.calc_rest(this.data.map(arr => arr.map(el => el.counter)), prices);
    }
}
