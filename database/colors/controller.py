import mysql.connector
from flask import Blueprint, abort, jsonify

from connection import cursor, as_json

colors = Blueprint('colors', __name__)


@colors.route('/', methods=['GET'])
def list_cohorts():
    try:
        cursor.execute("select * from colors")
        return jsonify(as_json(cursor)), 200
    except:
        abort(404)


@colors.route('/<int:color_id>')
def get_cohort(color_id):
    existing = None
    try:
        cursor.execute("SELECT * from colors WHERE id = {}".format(color_id))
        existing = cursor.fetchone()
    except mysql.connector.Error as error:
        print(error)
        abort(404)
    if existing is None:
        abort(404)
    result = dict(zip(cursor.column_names, existing))
    return jsonify(result), 200
