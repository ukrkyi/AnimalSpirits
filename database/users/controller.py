import mysql.connector
from flask import Blueprint, abort, jsonify, request

from connection import cursor, as_json, get_attr, mydb

users = Blueprint('users', __name__)


@users.route('/', methods=['GET'])
def list_users():
    try:
        cursor.execute("select * from users")
        return jsonify(as_json(cursor)), 200
    except:
        abort(404)


@users.route('/<int:user_id>')
def get_user(user_id):
    existing = None
    try:
        cursor.execute(
            "SELECT * from users WHERE id = {}".format(user_id))
        existing = cursor.fetchone()
    except mysql.connector.Error as error:
        print(error)
        abort(404)
    if existing is None:
        abort(404)
    result = dict(zip(cursor.column_names, existing))
    return jsonify(result), 200


@users.route('/', methods=['POST'])
def create_user():
    test_id = get_attr(request.json, 'id')
    if test_id:
        abort(422)
    username = get_attr(request.json, 'username')
    age = get_attr(request.json, 'age', True)
    sex = get_attr(request.json, 'sex', True)
    region = get_attr(request.json, 'region')
    password = get_attr(request.json, 'password')
    if type(username) is not str or len(username) > 255:
        abort(422)
    elif type(age) is not int or age < 0:
        abort(422)
    elif type(sex) is not str or len(sex) > 2:
        abort(422)
    elif type(region) is not str or len(region) > 255:
        abort(422)
    elif type(password) is not str or len(password) > 25:
        abort(422)
    if age is None:
        age = 'null'
    if sex is None:
        sex = 'null'
    if region is None:
        region = 'null'
    try:
        cursor.execute(
            f"INSERT INTO users (username ,age,sex,region,password) VALUES ('{username}','{age}',{sex},{region},{password});")
    except mysql.connector.Error as error:
        print(error)
        abort(422)
    user_id = cursor.lastrowid
    cursor.fetchone()
    mydb.commit()
    return get_user(user_id)[0], 201


@users.route('/<int:user_id>', methods=['DELETE'])
def delete_user(user_id):
    cursor.execute(f"SELECT * FROM users WHERE id = {user_id}")
    existing = cursor.fetchone()
    if existing is None:
        abort(404)
    try:
        cursor.execute(f"DELETE FROM user_id WHERE id = {user_id}")
        mydb.commit()
    except mysql.connector.Error as error:
        print(error)
        abort(500)
    return jsonify({}), 200
