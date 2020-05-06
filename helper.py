import os
from flask import Response, json, session
from pymongo import MongoClient

client = MongoClient(
#    "mongodb://todouser:pass1word@ds219051.mlab.com:19051/totlist"
    #os.environ['DB_PORT_27017_TCP_ADDR'], 27017
    "mongodb://db:27017/todolist"

)

def is_session():
    if ("WebAPIToken" not in session):
        return _send_list_JSON({"error": "Login into system please"}, 403)

def _send_list_JSON(instance=None, http_code=200):
    return Response(json.dumps(instance),
                    mimetype="application/json",
                    status=http_code)
