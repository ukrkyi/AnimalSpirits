import mysql.connector
from flask import Blueprint, abort, jsonify, request

from connection import get_attr, get_conn, as_json

results = Blueprint('results', __name__)

@results.route('/', methods=['GET'])
def list_results():
    try:
        mydb = get_conn()
        cursor = mydb.cursor()
        cursor.execute("select * from results")
        result = jsonify(as_json(cursor, cursor.fetchall())), 200
        cursor.close()
        mydb.close()
        return result
    except:
        abort(404)


@results.route('/<int:game_id>')
def get_game(game_id):
    existing = None
    mydb = get_conn()
    cursor = mydb.cursor()
    try:
        cursor.execute(
            "SELECT * from results WHERE game_id = {}".format(game_id))
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
    result = as_json(cursor, existing)
    cursor.close()
    mydb.close()
    return jsonify(result), 200


@results.route('/', methods=['POST'])
def create_game():
    test_id = get_attr(request.json, 'id')
    if test_id:
        abort(422)
    game_id = get_attr(request.json, 'game_id')
    if (type(game_id) is not int or game_id < 0):
        abort(422)
    nick = get_attr(request.json, 'nickname')
    if (type(nick) is not str or len(nick) > 255):
        abort(422)
    result = get_attr(request.json, 'result')
    if result is None or (type(result) is not float and type(result) is not int):
        abort(422)
    mydb = get_conn()
    cursor = mydb.cursor()
    try:
        cursor.execute(
            f"INSERT INTO results (game_id, name, result) VALUES ({game_id}, '{nick}', {result});")
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


@results.route('/<int:result_id>', methods=['DELETE'])
def delete_game(result_id):
    mydb = get_conn()
    cursor = mydb.cursor()
    cursor.execute(f"SELECT * FROM results WHERE id = {result_id}")
    existing = cursor.fetchone()
    if existing is None:
        cursor.close()
        mydb.close()
        abort(404)
    try:
        cursor.execute(f"DELETE FROM results WHERE id = {result_id}")
        mydb.commit()
    except mysql.Error as error:
        print(error)
        cursor.close()
        mydb.close()
        abort(500)
    cursor.close()
    mydb.close()
    return jsonify({}), 200
