import mysql.connector
from flask import Blueprint, abort, jsonify

from connection import get_conn, as_json

bonuses = Blueprint('bonuses', __name__)


@bonuses.route('/', methods=['GET'])
def list_bonuses():
    try:
        cursor.execute("select * from bonuses")
        return jsonify(as_json(cursor)), 200
    except:
        abort(404)


@bonuses.route('/<int:bonus_id>')
def get_type(bonus_id):
    existing = None
    try:
        cursor.execute("SELECT * from bonuses WHERE id = {}".format(bonus_id))
        existing = cursor.fetchone()
    except mysql.connector.Error as error:
        print(error)
        abort(404)
    if existing is None:
        abort(404)
    result = dict(zip(cursor.column_names, existing))
    return jsonify(result), 200
