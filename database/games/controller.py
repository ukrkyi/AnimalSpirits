import mysql.connector
from flask import Blueprint, abort, jsonify, request

from connection import cursor, as_json, get_attr, mydb

games = Blueprint('games', __name__)


@games.route('/', methods=['GET'])
def list_games():
    try:
        cursor.execute("select * from games")
        return jsonify(as_json(cursor)), 200
    except:
        abort(404)


@games.route('/<int:game_id>')
def get_game(game_id):
    existing = None
    try:
        cursor.execute(
            "SELECT * from games WHERE id = {}".format(game_id))
        existing = cursor.fetchone()
    except mysql.connector.Error as error:
        print(error)
        abort(404)
    if existing is None:
        abort(404)
    result = dict(zip(cursor.column_names, existing))
    return jsonify(result), 200


@games.route('/', methods=['POST'])
def create_game():
    test_id = get_attr(request.json, 'id')
    if test_id:
        abort(422)
    rounds = get_attr(request.json, 'rounds')
    if rounds is not None and (type(rounds) is not int or rounds < 0):
        abort(422)
    try:
        cursor.execute(
            f"INSERT INTO games ({'rounds' if rounds is not None else ''}) VALUES ({rounds if rounds is not None else ''});")
    except mysql.connector.Error as error:
        print(error)
        abort(422)
    game_id = cursor.lastrowid
    cursor.fetchone()
    mydb.commit()
    return get_game(game_id)[0], 201


@games.route('/<int:game_id>', methods=['DELETE'])
def delete_game(game_id):
    cursor.execute(f"SELECT * FROM games WHERE id = {game_id}")
    existing = cursor.fetchone()
    if existing is None:
        abort(404)
    try:
        cursor.execute(f"DELETE FROM games WHERE id = {game_id}")
        mydb.commit()
    except mysql.connector.Error as error:
        print(error)
        abort(500)
    return jsonify({}), 200
