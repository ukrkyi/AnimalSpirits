import mysql.connector
from flask import Blueprint, abort, jsonify, request

from connection import as_json, get_attr, get_conn

prices = Blueprint('prices', __name__)


@prices.route('/', methods=['GET'])
def list_prices():
    try:
        mydb = get_conn()
        cursor = mydb.cursor()
        cursor.execute("select * from prices")
        result = jsonify(as_json(cursor, cursor.fetchall())), 200
        cursor.close()
        mydb.close()
        return result
    except:
        abort(404)


@prices.route('/<int:game_id>')
def get_prices(game_id):
    existing = None
    mydb = get_conn()
    cursor = mydb.cursor()
    try:
        cursor.execute("SELECT * from prices WHERE game_id = {}".format(game_id))
        existing = cursor.fetchall()
    except mysql.Error as error:
        print(error)
        cursor.close()
        mydb.close()
        abort(404)
    if existing is None:
        cursor.close()
        mydb.close()
        abort(404)
    result = jsonify(as_json(cursor, existing)), 200
    cursor.close()
    mydb.close()
    return result


@prices.route('/', methods=['POST'])
def create_price():
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

    mydb = get_conn()
    cursor = mydb.cursor()
    try:
        cursor.execute(
            f"INSERT INTO prices (game_id, round, type_id, price) VALUES ('{game_id}', '{rounds}', '{type_id}', '{price}');")
    except mysql.connector.Error as error:
        print(error)
        cursor.close()
        mydb.close()
        abort(422)
    mydb.commit()
    cursor.close()
    mydb.close()
    return jsonify(request.json), 201


@prices.route('/', methods=['PUT'])
def update_price():
    game_id = get_attr(request.json, 'game_id')
    round = get_attr(request.json, 'round')
    type_id = get_attr(request.json, 'type_id')

    if type(game_id) != int or game_id < 1:
        abort(422)


    if type(rounds) != int or rounds < 1:
        abort(422)
    if type(type_id) != int or type_id < 1:
        abort(422)

    price = get_attr(request.json, 'price')

    if type(price) != int or price < 1:
        abort(422)
    mydb = get_conn()
    cursor = mydb.cursor()
    cursor.execute("SELECT * from prices WHERE game_id = {} AND type_id={} and round={}".format(game_id, type_id, round))
    existing = cursor.fetchone()
    if existing is None:
        cursor.close()
        mydb.close()
        abort(404)
    try:
        cursor.execute(
            f"UPDATE prices SET price = '{price}' WHERE game_id = '{game_id}' AND round = '{round}' AND type_id = '{type_id}';")
    except:
        cursor.close()
        mydb.close()
        abort(422)
    mydb.commit()
    cursor.close()
    mydb.close()
    return jsonify(request.json)


@prices.route('/<int:game_id>', methods=['DELETE'])
def delete_price(game_id):
    mydb = get_conn()
    cursor = mydb.cursor()
    cursor.execute("SELECT * from prices WHERE game_id = {}".format(game_id))
    existing = cursor.fetchone()
    if existing is None:
        cursor.close()
        mydb.close()
        abort(404)
    try:
        cursor.execute(
            f"DELETE FROM prices WHERE game_id = {game_id}")
        mydb.commit()
    except mysql.Error as error:
        print(error)
        cursor.close()
        mydb.close()

        abort(404)

    cursor.close()
    mydb.close()

    return jsonify({}), 200
