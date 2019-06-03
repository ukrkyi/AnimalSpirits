import {filter, map, pipe} from 'ramda';
import {ScoreEvaluation} from "./Evaluation/src/js/ScoreEvaluation";

function hide(...els) {
    els.forEach(el => el.style.display = "none");
}

const get_location = () => (window.location.hostname);

const is_valid = async (game_id) => {
    let response = await fetch(`http://${get_location()}:5000/games/${game_id}`);
    if (response.status === 200) {
        const json = await response.json();
        if (json.length !== 0) {
            return true;
        }
    } else {
        return false;
    }
};
const is_valid_tr = (game_id) => (true);

const hide_evaluation = () => {
    hide(document.querySelector(".Evaluation"));
    hide(document.querySelector(".Eval_button"))
};



const get_prices = async (game_id) => {
    game_id = parseInt(game_id);
    let all_prices = await (await fetch(`http://${get_location()}:5000/prices/`)).json();
    const select_by_id = pipe(filter((x) => (x["game_id"] === game_id)),
        map((x) => (x["price"])));
    all_prices = select_by_id(all_prices);
    return all_prices;
};

const get_id = () => {
    return document.querySelector(".Login__text-field").value;
};
const finish_login = () => {hide(document.querySelector(".Login"));};


const create_evaluation_button_and_get_result = (evaluator, prices, ) => {
    let evaluation_button = document.createElement("button");
    evaluation_button.className = "Eval_button";
    document.body.appendChild(evaluation_button);
    document.addEventListener('click', evt => {
        if(evt.target.matches(".Eval_button")){
            console.log(evaluator.getCount(prices));
            hide_evaluation();
        }
    });
};


const calculate_player_score = async (id) => {
    const prices = await get_prices(id);
    let eval_container = document.createElement("div");
    eval_container.className = "Evaluation";
    document.body.appendChild(eval_container);
    const evaluator = new ScoreEvaluation(eval_container, [1, 1 , 1, 1, 1],  Array.from({length: 4}, (_, i) =>
        Array.from({length: 5}, (_, j) => "./Evaluation/src/img/row-" + (i + 1) + "-col-" + (j + 1) + ".png"))
        .concat([Array(5).fill("./Evaluation/src/img/icon.png")]));
    create_evaluation_button_and_get_result(evaluator, prices);
};


document.addEventListener('click', async evt => {
    if (evt.target.matches(".Login__submit-button")) {
        const id = get_id();
        if (await is_valid(id)) {
            finish_login();
            await calculate_player_score(id);
            console.log("OK");
        } else {
            alert("Wrong id");
        }
    }
});

