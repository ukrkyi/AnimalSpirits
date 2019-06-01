from flask import Flask


app = Flask(__name__,static_url_path='/static')

from colors.controller import colors
from card_types.controller import card_types
from bonuses.controller import bonuses
from cards.controller import cards
from records.controller import records
from users.controller import users
from games.controller import games


app.register_blueprint(colors, url_prefix="/colors")
app.register_blueprint(card_types, url_prefix="/card_types")
app.register_blueprint(bonuses, url_prefix="/bonuses")
app.register_blueprint(cards, url_prefix="/cards")
app.register_blueprint(records, url_prefix="/records")
app.register_blueprint(users, url_prefix="/users")
app.register_blueprint(games, url_prefix="/games")


if __name__ == '__main__':
    app.config['SEND_FILE_MAX_AGE_DEFAULT'] = 0
    app.run(debug = True)
