import {filter, map, pipe} from 'ramda';
import {ScoreEvaluation} from "./Evaluation/src/js/ScoreEvaluation";

let nickname, id, score;


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

const hide_evaluation = () => {
    hide(document.querySelector(".Evaluation"));
    hide(document.querySelector(".Eval_button"))
};


const get_prices = async (game_id) => {
    game_id = parseInt(game_id);
    let all_prices = await (await fetch(`http://${get_location()}:5000/prices/${game_id}`)).json();
    all_prices = all_prices.sort((a, b) => a["type_id"] - b["type_id"]).map((x) => (x["price"]));
    return all_prices;
};

const get_id = () => {
    return parseInt(document.querySelector(".Login__text-field").value);
};
const get_username = () => {
    return document.querySelector(".User__text-field").value;
};
const finish_login = () => {
    hide(document.querySelector(".Login"));
};

const init_and_handle_authentification = () =>{
    document.body.innerHTML += "<main class=\"User\">\n" +
        "        <div class=\"User__inputs\">\n" +
        "            <input class=\"User__text-field\" placeholder=\"Enter your nickname\" type=\"text\">\n" +
        "            <button class=\"User__submit-button\" type=\"button\">\n" +
        "                Enter room\n" +
        "            </button>\n" +
        "        </div>\n" +
        "</main>"
};
const post_config = (data, put = false) => ({
    method: put ? 'PUT' : 'POST',
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
    },
    body: JSON.stringify(data)
});

let results_sent = false;

const send_results = async () => {
    let config = post_config({
        "game_id": id,
        "nickname": nickname,
        "result": score
    }, results_sent);
    results_sent = true;
    return await (await fetch(`http://${get_location()}:5000/results/`, config)).json();
};

const create_evaluation_button_and_get_result =  (evaluator, prices) => {
    let evaluation_button = document.createElement("button");
    evaluation_button.className = "Eval_button";
    document.body.appendChild(evaluation_button);
    document.addEventListener('click', async evt =>  {
        if (evt.target.matches(".Eval_button")) {
            score = evaluator.getCount(prices);
            console.log(score);
            await send_results();
            hide_evaluation();
            let data = [];
            let table = document.createElement("div");
            table.className = "Game__Process-result";
            table.style.display = "grid";
            document.body.appendChild(table);
            do {
                await new Promise(resolve => setTimeout(resolve, 500));
                let results = await (await fetch(`http://${get_location()}:5000/results/${id}`)).json();
                let added = results.filter(tested => !data.some(el => el["id"] === tested["id"]));
                added.forEach(el => {
                    let name = document.createElement("div");
                    name.innerHTML = `${el["name"]}`;
                    let result = document.createElement("div");
                    result.innerHTML = `${el["result"]}`;
                    if (el["name"] === nickname) {
                        name.style.background = result.style.background = "yellow";
                    }
                    table.appendChild(name);
                    table.appendChild(result);
                });
                data.push(...added);
            } while(1);
        }
    })
};


const calculate_player_score = async (id) => {
    const prices = await get_prices(id);
    let eval_container = document.createElement("div");
    eval_container.className = "Evaluation";
    document.body.appendChild(eval_container);
    const evaluator = new ScoreEvaluation(eval_container, [5, 3, 3, 2], Array.from({length: 5}, (_, i) =>
        Array.from({length: 5}, (_, j) => "./Evaluation/src/img/row-" + (i + 1) + "-col-" + (j + 1) + ".jpg")));
    await create_evaluation_button_and_get_result(evaluator, prices);
};


document.addEventListener('click', async evt => {
    if (evt.target.matches(".Login__submit-button")) {
        id = get_id();
        if (await is_valid(id)) {
            finish_login();
            init_and_handle_authentification();
        } else {
            alert("Wrong id");
        }
    }else if (evt.target.matches(".User__submit-button")) {
            nickname = get_username();
            hide(document.querySelector(".User"));
            await calculate_player_score(id);
            console.log("OK");
        }
    });