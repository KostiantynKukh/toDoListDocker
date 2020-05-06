import jwt, os, sys, uuid
from bson.objectid import ObjectId
from flask import (
    Blueprint,
    Response,
    redirect,
    url_for,
    request,
    session,
    json
)
from pymongo import errors

from helper import _send_list_JSON, client, is_session

db = client['totlist']

taskRouter = Blueprint('taskRouter', __name__)

@taskRouter.route('/api/tasks', methods=['GET'])
def tasks_list():
    if ("WebAPIToken" not in session):
        return _send_list_JSON({"error": "Login into system please"}, 403)
    _items = db.todos.find({"user_id": session["WebAPIToken"]})
    items = list()
    for item in _items:
        item["id"] = str(item["_id"])
        del item["_id"]
        del item["user_id"]
        items.append(item)

    return _send_list_JSON(items)


@taskRouter.route('/api/tasks', methods=['POST'])
def add_task():
    if ("WebAPIToken" not in session):
        return _send_list_JSON({"error": "Login into system please"}, 403)

    jsonbody = request.get_json()

    userToken = jwt.decode(jsonbody['WebAPIToken'], 'secret', algorithms=['HS256'])
    if (userToken["id"] == session["WebAPIToken"]):
        jsonbody["user_id"] = session["WebAPIToken"]
        del jsonbody['WebAPIToken']
    
        try:
            db.todos.insert(jsonbody)
            jsonbody["id"] = str(jsonbody["_id"])
            del jsonbody["_id"]
            del jsonbody["user_id"]
            return _send_list_JSON(jsonbody)
        except Exception as e:
            return _send_list_JSON({"error": e}, 400)
    else:
        return _send_list_JSON({"error": "Login into system please"}, 403)


@taskRouter.route('/api/tasks/<task_id>', methods=['GET'])
def get_task_by_id(task_id):
    if ("WebAPIToken" not in session):
        return _send_list_JSON({"error": "Login into system please"}, 403)
    
    jsonbody = db.todos.find_one({"_id": ObjectId(task_id)})
    del jsonbody["_id"]
    del jsonbody["user_id"]
    return _send_list_JSON(jsonbody)


@taskRouter.route('/api/tasks/<task_id>', methods=['PUT'])
def put_task_by_id(task_id):
    jsonbody = request.get_json()
    if ("WebAPIToken" not in session):
        return _send_list_JSON({"error": "Login into system please"}, 403)
    elif (jwt.decode(jsonbody['WebAPIToken'], 'secret', algorithms=['HS256'])['id'] == session["WebAPIToken"]):
        try:
            del jsonbody["WebAPIToken"]
            db.todos.update({"_id": ObjectId(task_id)},
                {"$set": jsonbody}
            )
            updateresult = db.todos.find_one({"_id": ObjectId(task_id)})
            del updateresult["_id"]
            return _send_list_JSON(updateresult)
        except Exception, e:
            return _send_list_JSON({"error": e}, 400)
    else: 
        return _send_list_JSON({"error": "Access forbiden"}, 403)


@taskRouter.route('/api/tasks/<task_id>', methods=['DELETE'])
def delete_task_by_id(task_id):
    if ("WebAPIToken" not in session):
        return _send_list_JSON({"error": "Login into system please"}, 403)
    jsonbody = db.todos.find_one({"_id": ObjectId(task_id)})
    if jsonbody["user_id"] == session["WebAPIToken"]:
        db.todos.delete_one(jsonbody)
    return _send_list_JSON({"message": "task was deleted"}, 200)