import mysql.connector
from flask import Blueprint, abort, jsonify, request

from connection import cursor, as_json, get_attr, mydb

prices = Blueprint('prices', __name__)


@prices.route('/', methods=['GET'])
def list_prices():
    try:
        cursor.execute("select * from prices")
        return jsonify(as_json(cursor)), 200
    except:
        abort(404)


@prices.route('/<int:price_id>')
def get_price(price_id):
    existing = None
    try:
        cursor.execute("SELECT * from prices WHERE game_id = {}".format(price_id))
        existing = cursor.fetchone()
    except mysql.connector.Error as error:
        print(error)
        abort(404)
    if existing is None:
        abort(404)
    result = dict(zip(cursor.column_names, existing))
    return jsonify(result), 200


@prices.route('/', methods=['POST'])
def create_price():
    print("Json")
    print(request.json)
    game_id = get_attr(request.json, 'game_id')
    rounds = get_attr(request.json, 'round')
    type_id = get_attr(request.json, 'type_id')
    price = get_attr(request.json, 'price')

    if type(game_id) != int or game_id < 1:
        abort(422)
    if type(rounds) != int or rounds < 1:
        abort(422)
    if type(type_id) != int or type_id < 1:
        abort(422)
    if type(price) != int or price < 1:
        abort(422)

    try:
        cursor.execute(
            f"INSERT INTO prices (game_id, round, type_id, price) VALUES ('{game_id}', '{rounds}', '{type_id}', '{price}');")
    except mysql.connector.Error as error:
        print(error)
        abort(422)
    game_id = cursor.lastrowid
    cursor.fetchone()
    mydb.commit()
    return get_price(game_id)[0], 201


@prices.route('/', methods=['PUT'])
def update_price():
    game_id = get_attr(request.json, 'game_id')

    if type(game_id) != int and game_id < 1:
        abort(422)

    cursor.execute("SELECT * from prices WHERE game_id = {}".format(game_id))
    existing = cursor.fetchone()
    if existing is None:
        abort(404)
    rounds = get_attr(request.json, 'rounds')
    type_id = get_attr(request.json, 'type_id')
    price = get_attr(request.json, 'price')

    if type(rounds) != int and rounds < 1:
        abort(422)
    if type(type_id) != int and type_id < 1:
        abort(422)
    if type(price) != int and price < 1:
        abort(422)
    try:
        cursor.execute(
            f"UPDATE prices SET rounds = '{rounds}', type_id = '{type_id}', price = '{price}' WHERE game_id = '{game_id}';")
    except:
        abort(422)
    mydb.commit()
    return get_price(game_id)


@prices.route('/<int:game_id>', methods=['DELETE'])
def delete_price(game_id):
    cursor.execute("SELECT * from prices WHERE game_id = {}".format(game_id))
    existing = cursor.fetchone()
    if existing is None:
        abort(404)
    try:
        cursor.execute(
            f"DELETE FROM prices WHERE game_id = {game_id}")
        mydb.commit()
    except mysql.connector.Error as error:
        print(error)
        abort(404)
    return jsonify({}), 200
