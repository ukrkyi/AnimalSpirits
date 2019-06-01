

is_valid = async  (game_id) =>{
    let response = await fetch("localhost/games/{game_id}");
    if(!response.empty){
        return true;
    }
};
is_valid_tr = (game_id) => (true);

document.addEventListener()

