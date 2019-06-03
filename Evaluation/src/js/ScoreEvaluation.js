function find_distinct(matrix, used) {
    let i = used.length;
    if (i === matrix.length)
        return used;
    for (let j = 0; j < matrix[i].length; j++) {
        if (!used.includes(j) && matrix[i][j] > 0) {
            used.push(j);
            let res = find_distinct(matrix, used);
            if (res.length)
                return res;
            else
                used.pop();
        }
    }
    return [];
}

export class ScoreEvaluation {
    constructor(container, coeffs, images) {
        this.container = container;
        this.data = images.map(img_arr => img_arr.map(img => ({image: img, counter: 0})));
        this.coeffs = coeffs;
        this.render();
        this.initHandlers();
    }

    renderCards() {
        return this.data.map(
            (data_array, i) => data_array.map(
                (element, j) => `<div class="Evaluation__card" data-row="${i}" data-column="${j}">
<img class="Evaluation__card-image" src="${element.image}" />
<div class="Evaluation__card-count">${element.counter}</div></div>`)
                .join(''))
            .join('')
    }

    render() {
        this.container.innerHTML = `
        ${this.renderCards()}  `
    }

    initHandlers() {
        this.container.addEventListener('click', ev => {
            if (ev.target.matches('.Evaluation__card') || ev.target.matches('.Evaluation__card *')) {
                let counter = ev.target.matches('.Evaluation__card') ? ev.target : ev.target.parentElement;
                let row = Number(counter.getAttribute("data-row"));
                let col = Number(counter.getAttribute("data-column"));
                let el = this.data[row][col];
                if (el.counter < 5) {
                    el.counter++;
                }
                counter.getElementsByClassName("Evaluation__card-count")[0].innerHTML = el.counter;
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
        let coeffs = find_distinct(matrix, []);
        if (coeffs.length) {
            let sum = prices.reduce((sum, el) => sum + el * this.coeffs[3], 0) + this.calc_rest(matrix.map((row, nrow) => row.map((el, cur) => (cur === coeffs[nrow] ? el - 1 : el))), prices);
            if (sum > max_sum)
                max_sum = sum;
        }
        return max_sum;
    }

    getCount(prices) {
        return this.calc_rest(this.data.map(arr => arr.map(el => el.counter)), prices);
    }
}
