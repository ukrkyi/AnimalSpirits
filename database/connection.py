import os

import mysql.connector
from flask import abort

host = os.environ.get('DB_HOST', 'localhost')
def get_conn():
    return mysql.connector.connect(host=host, user='animal',
                               password='shit',
                               database='animalspirits',
                               auth_plugin='mysql_native_password')


def as_json(cursor, data):
    return [dict(zip(cursor.column_names, el)) for el in data]


def get_attr(obj, key, can_be_null=False):
    if key in obj:
        if can_be_null:
            return obj[key]
        if obj[key] is None:
            abort(422)
        else:
            return obj[key]
