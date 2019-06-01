import mysql.connector
from flask import Blueprint, abort, jsonify

from connection import cursor, as_json

records = Blueprint('records', __name__)


@records.route('/', methods=['GET'])
def list_records():
    try:
        cursor.execute("select * from records")
        return jsonify(as_json(cursor)), 200
    except:
        abort(404)


@records.route('/<int:record_id>')
def get_record(record_id):
    existing = None
    try:
        cursor.execute("SELECT * from records WHERE game_id = {}".format(record_id))
        existing = cursor.fetchone()
    except mysql.connector.Error as error:
        print(error)
        abort(404)
    if existing is None:
        abort(404)
    result = dict(zip(cursor.column_names, existing))
    print(result)
    return jsonify(result), 200