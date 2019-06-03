import mysql.connector
from flask import Blueprint, abort, jsonify

from connection import get_conn, as_json

card_types = Blueprint('card_types', __name__)


@card_types.route('/', methods=['GET'])
def list_types():
    try:
        mydb = get_conn()
        cursor = mydb.cursor()
        cursor.execute("select * from types")
        result = jsonify(as_json(cursor)), 200
        cursor.close()
        mydb.close()
        return result
    except:
        abort(404)


@card_types.route('/<int:type_id>')
def get_type(types_id):
    existing = None
    mydb = get_conn()
    cursor = mydb.cursor()
    try:
        cursor.execute("SELECT * from types WHERE id = {}".format(types_id))
        existing = cursor.fetchone()
    except mysql.Error as error:
        cursor.close()
        mydb.close()
        print(error)
        abort(404)
    if existing is None:
        cursor.close()
        mydb.close()
        abort(404)
    result = dict(zip(cursor.column_names, existing))
    cursor.close()
    mydb.close()
    return jsonify(result), 200
