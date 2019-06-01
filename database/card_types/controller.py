import mysql.connector
from flask import Blueprint, abort, jsonify

from connection import cursor, as_json

card_types = Blueprint('card_types', __name__)


@card_types.route('/', methods=['GET'])
def list_types():
    try:
        cursor.execute("select * from types")
        return jsonify(as_json(cursor)), 200
    except:
        abort(404)


@card_types.route('/<int:type_id>')
def get_type(types_id):
    existing = None
    try:
        cursor.execute("SELECT * from types WHERE id = {}".format(types_id))
        existing = cursor.fetchone()
    except mysql.connector.Error as error:
        print(error)
        abort(404)
    if existing is None:
        abort(404)
    result = dict(zip(cursor.column_names, existing))
    return jsonify(result), 200
