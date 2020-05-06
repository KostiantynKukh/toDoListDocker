import bson, jwt

from flask import (
    Blueprint,
    url_for,
    request,
    session
)

from helper import _send_list_JSON, client

userRouter = Blueprint('userRouter', __name__)

db = client['totlist']

@userRouter.route('/api/auth', methods=['POST'])
def login():
    jsonbody = request.get_json()
    document = dict()
    try:
        document["id"] = str(db.users.find_one(jsonbody)["_id"])
        session["WebAPIToken"] = document["id"]
        encoded = jwt.encode(document, 'secret', algorithm='HS256')

        return _send_list_JSON({"WebAPIToken": encoded})
    except:
        return _send_list_JSON({"error": "Login into system please"}, 403)

@userRouter.route('/api/auth/out', methods=['GET'])
def get_token():
    session.pop("WebAPIToken", None)

    return _send_list_JSON({"message": "User logged out"})

@userRouter.route('/api/user/add', methods=['POST'])
def add_new_user():
    jsonbody = request.get_json()
    if ("username" in jsonbody) and ("password" in jsonbody):
        result = db.users.insert_one(jsonbody)

        document = dict()
        document = db.users.find_one({"_id": result.inserted_id})
        document["id"] = str(document["_id"])
        del document["_id"]

        return _send_list_JSON(document, 201)
