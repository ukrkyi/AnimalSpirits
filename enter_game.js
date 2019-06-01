is_valid = async (game_id) => {
    console.log("Blyat");
    let response = await fetch(`http://127.0.0.1:5000/games/${game_id}`);
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

const get_id = () => {
    return document.querySelector(".Login__text-field").value;
};
document.addEventListener('click', async evt => {
    if(evt.target.matches(".Login__submit-button")){
        const id = get_id();
        console.log(id);
        if(await is_valid(id)){
            // window.location.replace("./index.html");
            console.log("OK");
        }else{
            alert("Wrong_id");
        }
    }

});

