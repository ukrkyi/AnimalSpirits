is_valid = async (game_id) => {
    let response = await fetch("localhost/games/{game_id}");
    if (!response.empty) {
        return true;
    }
};
is_valid_tr = (game_id) => (true);

const get_id = () => {
    return document.querySelector(".Login__text-field").value;
};
document.addEventListener('click', evt => {
    if(evt.target.matches(".Login__submit-button")){
        const id = get_id();
        if(is_valid_tr(id)){
            window.location.replace("./index.html");
        }else{
            alert("Wrong_id");
        }
    }

});

