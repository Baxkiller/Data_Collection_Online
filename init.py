# -*- codeing = utf-8 -*-
# @Time       : 2022/11/17 21:24
# @Author     : Baxkiller
# @File       : init.py
# @Software   : PyCharm
# @Description:

# -*- coding: utf-8 -*-
from flask import Flask, jsonify, render_template, request
import json
import os

app = Flask(__name__, template_folder = './static/templates')  # 实例化app对象
testInfo = {}

@app.route('/save_data', methods = ['POST'])  # 路由
def save_data():
    JsonData = json.loads(request.form.get('value'))
    savePath = request.form.get('path')

    with open(savePath, "w") as f:
        json.dump(JsonData, f)
    return ""


@app.route('/')
def index():
    return render_template('index.html')


if __name__ == '__main__':
    app.run(host = '0.0.0.0',  # 任何ip都可以访问
            port = 7777,  # 端口
            debug = True
            )
