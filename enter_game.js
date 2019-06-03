function hide(...els) {
    els.forEach(el => el.style.display = "none");
}
const get_location = () => (window.location.hostname);

is_valid = async (game_id) => {
    console.log("Blyat");
    let response = await fetch(`http://${get_location()}:5000/games/${game_id}`);
    console.log(response.status);
    if(response.status === 200){
        const json = await response.json();
        console.log(json);
        if (json.length !== 0) {
            return true;
        }
    } else {
        return false;
    }
};
is_valid_tr = (game_id) => (true);


const get_prices = async  (game_id) =>
{

    let all_prices = await (await fetch(`http://${get_location()}:5000/prices/`)).json();
    console.log(all_prices);
};

const get_id = () => {
    return document.querySelector(".Login__text-field").value;
};

document.addEventListener('click', async evt => {
    if(evt.target.matches(".Login__submit-button")){
        const id = get_id();
        console.log(id);
        if(await is_valid(id)){
            hide(document.querySelector(".Login"));
            await  get_prices();
            console.log("OK");
        }else{
            alert("Wrong_id");
        }
    }

});

