import os

import mysql.connector
from flask import abort

host = os.environ.get('DB_HOST', 'localhost')
mydb = mysql.connector.connect(host=host, user='gamer',
                               password='gamer',
                               database='game',
                               auth_plugin='mysql_native_password')
cursor = mydb.cursor()


def as_json(curs):
    row_headers = [x[0] for x in
                   curs.description]
    rv = curs.fetchall()
    json_data = []
    for result in rv:
        json_data.append(dict(zip(row_headers, result)))
    return json_data


def get_attr(obj, key, can_be_null=False):
    if key in obj:
        if can_be_null:
            return obj[key]
        if obj[key] is None:
            abort(422)
        else:
            return obj[key]
