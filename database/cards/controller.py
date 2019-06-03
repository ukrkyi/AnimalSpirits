import mysql.connector
from flask import Blueprint, abort, jsonify

from connection import get_conn, as_json

cards = Blueprint('cards', __name__)


@cards.route('/', methods=['GET'])
def list_cards():
    try:
        cursor.execute("select * from cards")
        return jsonify(as_json(cursor)), 200
    except:
        abort(404)


@cards.route('/<int:color_id>/<int:type_id>')
def get_card(color_id, type_id):
    existing = None
    try:
        cursor.execute(
            f"select * from cards where color_id = {color_id} and type_id = {type_id};")
        existing = cursor.fetchone()
    except mysql.connector.Error as error:
        print(error)
        abort(404)
    if existing is None:
        abort(404)
    result = dict(zip(cursor.column_names, existing))
    return jsonify(result), 200
