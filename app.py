import os, sys, uuid
from flask import Flask, Response, redirect, url_for, request, render_template, json
from pymongo import MongoClient, errors

from helper import client
from routes.taskapp import taskRouter
from routes.userapp import userRouter

app = Flask(__name__)


app.static_url_path = '/static'
app.secret_key = '5m[:e?}DP6ikFmAlPV3F'
app.register_blueprint(taskRouter)
app.register_blueprint(userRouter)

db = client['totlist']


@app.route('/')
def todo():
    return render_template('index.html')

if __name__ == "__main__":
    app.run(host='0.0.0.0', debug=True)
