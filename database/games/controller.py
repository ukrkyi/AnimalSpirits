import mysql.connector
from flask import Blueprint, abort, jsonify, request

from connection import get_attr, get_conn, as_json

games = Blueprint('games', __name__)


@games.route('/', methods=['GET'])
def list_games():
    try:
        mydb = get_conn()
        cursor = mydb.cursor()
        cursor.execute("select * from games")
        result = jsonify(as_json(cursor, cursor.fetchall())), 200
        cursor.close()
        mydb.close()
        return result
    except:
        abort(404)


@games.route('/<int:game_id>')
def get_game(game_id):
    existing = None
    mydb = get_conn()
    cursor = mydb.cursor()
    try:
        cursor.execute(
            "SELECT * from games WHERE id = {}".format(game_id))
        existing = cursor.fetchone()
    except mysql.Error as error:
        print(error)
        cursor.close()
        mydb.close()
        abort(404)
    if existing is None:
        cursor.close()
        mydb.close()
        abort(404)
    result = dict(zip(cursor.column_names, existing))
    cursor.close()
    mydb.close()
    return jsonify(result), 200


@games.route('/', methods=['POST'])
def create_game():
    test_id = get_attr(request.json, 'id')
    if test_id:
        abort(422)
    rounds = get_attr(request.json, 'rounds')
    if rounds is not None and (type(rounds) is not int or rounds < 0):
        abort(422)
    mydb = get_conn()
    cursor = mydb.cursor()
    try:
        cursor.execute(
            f"INSERT INTO games ({'rounds' if rounds is not None else ''}) VALUES ({rounds if rounds is not None else ''});")
    except mysql.Error as error:
        print(error)
        cursor.close()
        mydb.close()
        abort(422)
    game_id = cursor.lastrowid
    mydb.commit()
    cursor.close()
    mydb.close()
    return get_game(game_id)[0], 201


@games.route('/<int:game_id>', methods=['DELETE'])
def delete_game(game_id):
    mydb = get_conn()
    cursor = mydb.cursor()
    cursor.execute(f"SELECT * FROM games WHERE id = {game_id}")
    existing = cursor.fetchone()
    if existing is None:
        cursor.close()
        mydb.close()
        abort(404)
    try:
        cursor.execute(f"DELETE FROM games WHERE id = {game_id}")
        mydb.commit()
    except mysql.Error as error:
        print(error)
        cursor.close()
        mydb.close()
        abort(500)
    cursor.close()
    mydb.close()
    return jsonify({}), 200
