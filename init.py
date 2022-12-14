# -*- codeing = utf-8 -*-
# @Time       : 2022/11/17 21:24
# @Author     : Baxkiller
# @File       : init.py
# @Software   : PyCharm
# @Description: 数据池中全部是当前未标记的数据
#               不需要担心数据被同一个人二次标注(?!)

from flask import Flask, jsonify, render_template, request, current_app
from json.decoder import JSONDecodeError
from flask_apscheduler import APScheduler

import json
import random
import time
import os

import logging
from logging.handlers import TimedRotatingFileHandler

app = Flask(__name__, template_folder = './static/templates')  # 实例化app对象

userLabelInfo = dict()
allDatas = dict()  # 所有的数据
availableDataIndex = list()
userTimeStamp = dict()  # 每个用户有一个时间戳
allUsers = dict()
tryData = dict()
submitTime = dict()

num_times = 0  # 设定一条数据可以被几个人标记
timeLimit = 0  # 设定十分钟的时间,超过此事件释放资源
checkExpiredTime = 0  # 每过checkExpired即检查是否有到期数据


# 释放数据,哪个用户要释放哪条数据
# 更新userLabelInfo,availabelDataIndex,userTimeStamp
# mode代表是0被动释放还是1主动释放
def freeData(uid, idx, mode):
    # 被动释放需要一致性检查
    if idx == -1:
        return

    if userLabelInfo[uid]['labeling'] != idx:

        infos = "{} Error! Free data {} but labeling {}".format(uid, idx, userLabelInfo[uid]["labeling"])
        current_app.logger.info(infos)
        print(infos)

        if idx in userLabelInfo[uid]['labeled']:
            userTimeStamp[uid]['index'] = userLabelInfo[uid]['labeling']
            return
        else:
            if idx not in availableDataIndex:
                availableDataIndex.append(idx)
            userTimeStamp[uid]["index"] = -userLabelInfo[uid]['labeling']
        return

    # 修改时间戳和当前标注内下标
    userLabelInfo[uid]['labeling'] = -1
    availableDataIndex.append(idx)
    userTimeStamp[uid]['time'] = 0
    userTimeStamp[uid]['index'] = -1
    # 更新记录时间
    update_submitTime(uid, idx, "del")

    infos = "USER {} free DATA {}".format(uid, idx)
    with app.app_context():
        current_app.logger.info(infos)
    print(infos)

    # 修改即保存是个好习惯
    saveULI()
    saveADI()
    saveUTS()


def exitWithSave():
    saveULI()
    saveADI()
    saveUTS()
    print("All the task Finished!")


def saveULI():
    with open("./static/userData/userLabelInfo.json", "w") as f:
        json.dump(userLabelInfo, f)


def saveADI():
    with open("./static/userData/toLabelInfo.json", "w") as f:
        json.dump(availableDataIndex, f)


def saveUTS():
    with open("./static/userData/timeStamps.json", "w") as f:
        json.dump(userTimeStamp, f)
    with open("./static/userData/submitTime.json", "w") as f:
        json.dump(submitTime, f)


# 时间戳以服务器系统时间为准
def timeStamp():
    return int(time.time())


def getTrueIdx(idx):
    return idx // num_times


# 给定虚假下标,得到对应数据
def getTrueData(idx):
    if idx == -1:
        return {"joker": "smile"}
    return allDatas[getTrueIdx(idx)]


# 随机获得可用数据下标
# 该数据下标为虚假下标,除此处判断外,其他记录皆用虚假下表
def randDataIndex(uid):
    cnt = len(availableDataIndex)

    # 没有数据可用了,已经全部标记完成,或者还剩当前正在标注中的数据了
    # 主动退出整个程序?
    if cnt == 0 or len(userLabelInfo[uid]['labeled']) == len(allDatas):
        # 检查是否有正在标注的人
        for k, v in userTimeStamp.items():
            if v["index"] != -1:
                return -1
        # 如果都等于-1
        exitWithSave()
        return -1

    if len(userLabelInfo[uid]['labeled']) == 0:
        trueLabeled = []
    else:
        trueLabeled = []
        for i in userLabelInfo[uid]['labeled']:
            trueLabeled.append(getTrueIdx(i))

    index = 0
    while index < len(availableDataIndex):
        # pos = random.randint(0, cnt - 1)
        # idx = availableDataIndex[pos]
        idx = availableDataIndex[index]
        if getTrueIdx(idx) in trueLabeled:  # 如果用户之前标注过这个数据
            index = index + 1
            continue
        else:  # 用户没有标注过这条数据
            return idx


# 检查是否有过期的资源要被释放,每次释放所有过期的
def checkExpired():
    curTime = timeStamp()
    print("Check Expired...")

    noTaskCnt = 0

    for k, v in userTimeStamp.items():
        if curTime - v['time'] >= timeLimit:
            freeData(k, v['index'], 0)
        if v['index'] == -1:
            noTaskCnt += 1
    if len(availableDataIndex) == 0 and noTaskCnt == len(userTimeStamp) and noTaskCnt > 0:
        exitWithSave()


def checkUser(uid):
    if allUsers.get(uid) is None:
        return -1
    else:
        return 1


# 只负责单纯地保存数据
# 根据是否存在这组数据决定是直接创建还是add
def save_data(uid, score, idx, suggest_score):
    path = "./static/data/" + str(idx) + ".json"
    if os.path.exists(path):
        with open(path, "r") as f:
            tmp = json.load(f)
            tmp['usr'][uid] = score
            tmp['revise'][uid]=suggest_score
        with open(path, "w") as f:
            json.dump(tmp, f)
    else:
        with open(path, "w") as f:
            tmp = allDatas[idx].copy()
            tmp["usr"] = dict()
            tmp["revise"] = dict()
            tmp["usr"][uid] = score
            tmp["revise"][uid] = suggest_score
            json.dump(tmp, f)
    return


def update_submitTime(uid, idx, type):
    idx = str(idx)
    if submitTime.get(uid) is None:
        submitTime[uid] = dict()
    if type == "start":
        submitTime[uid][idx] = dict()
        submitTime[uid][idx][type] = time.time()
    elif type == "del":
        try:
            del submitTime[uid][idx]
        except KeyError:
            pass
    else:
        submitTime[uid][idx][type] = time.time()


def save_submitTime(uid, idx):
    idx = str(idx)
    try:
        interval_time = int(submitTime.get(uid).get(idx).get("end") - submitTime[uid][idx]["start"])
        submitTime[uid][idx] = interval_time
    except KeyError:
        interval_time = -1
        submitTime[uid][idx] = interval_time
    with open("./static/userData/submitTime.json", "w") as f:
        json.dump(submitTime, f)


def getTryData():
    return random.randint(0, len(tryData) - 1)


# 用户登陆后请求mode=0/用户提交一个后请求mode=1
# 更新userLabelInfo(正在标注),availableDataIndex(分配数据),userTimeStamp
@app.route('/requestData', methods = ['POST'])
def requestData():
    uid = request.form.get('uid')
    mode = eval(request.form.get('mode'))

    if checkUser(uid) == -1:
        return jsonify({'status': 400, 'msg': 'USER NOT FOUND :(', 'index': -2})

    # 新加入用户为其创建相关资料
    if userLabelInfo.get(uid) is None:
        userLabelInfo[uid] = dict()
        userLabelInfo[uid]['labeling'] = -1
        userLabelInfo[uid]['labeled'] = list()
        userLabelInfo[uid]['try_labeled'] = list()

        userTimeStamp[uid] = dict()
        userTimeStamp[uid] = {"time": 0, "index": -1}

    # if len(userLabelInfo[uid]["try_labeled"]) == 0:
    #     dataIdx = getTryData()
    #     userLabelInfo[uid]["try_labeling"] = dataIdx
    #     return json.dumps({'d':tryData[dataIdx],})

    # 数据分配
    if mode == 0 and userLabelInfo[uid]['labeling'] != -1:  # 用户从登录页进入并分配数据,且上次分配数据尚未被分配走
        userTimeStamp[uid]['time'] = timeStamp()
        userTimeStamp[uid]['index'] = userLabelInfo[uid]['labeling']
        data_index = userLabelInfo[uid]['labeling']  # 上次标注的数据
    else:  # mode=1持续请求/mode=0 && data['labeling'] ==-1已经被抢走
        data_index = randDataIndex(uid)
        # 只有连续请求会出现同一组数据,为了避免这个问题,这里再次请求随机数据
        if getTrueIdx(userLabelInfo[uid]['labeling']) == getTrueIdx(data_index):
            data_index = randDataIndex(uid)

        userLabelInfo[uid]['labeling'] = data_index
        try:
            availableDataIndex.remove(data_index)  # 将本次分配的数据从表格中删除
        except ValueError:
            pass

    # 更新时间戳
    if data_index != -1:
        userTimeStamp[uid]['time'] = timeStamp()
    else:
        userTimeStamp[uid]['time'] = 0
    userTimeStamp[uid]['index'] = data_index
    update_submitTime(uid, data_index, "start")

    saveUTS()
    saveADI()
    saveULI()

    infos = "USER {} get DATA {}".format(uid, data_index)
    current_app.logger.info(infos)
    print(infos)

    return json.dumps({
        "d": getTrueData(data_index),
        "index": data_index,
        "cnt": len(userLabelInfo[uid]["labeled"])
    })


# # 请示释放当前资源
# @app.route('/requestFree', methods = ['POST'])
# def requestFree():
#     uid = request.form.get('uid')
#     idx = eval(request.form.get('index'))
#     freeData(uid, idx, 1)
#     print("USER {} free(1) DATA {}".format(uid, idx))
#     return ""


# 更新userLabelInfo(labeled,labeling)
@app.route('/submitScore', methods = ['POST'])
def submitScore():
    data = request.form
    uid = data.get('uid')
    score = json.loads(data.get('score'))
    index = eval(data.get('index'))
    suggest_score = json.loads(data.get('suggest_score'))

    if checkUser(uid) == -1:
        return jsonify({'status': 400, 'msg': 'USER NOT FOUND :('})

    save_data(uid, score, getTrueIdx(index), suggest_score)
    update_submitTime(uid, index, "end")
    save_submitTime(uid, index)
    have_same_tidx = False

    # 防止提交重复数据,如果提交了重复数据,这里不计入
    for i in userLabelInfo[uid]['labeled']:
        if getTrueIdx(i) == getTrueIdx(index):
            have_same_tidx = True
            break

    # 不计入
    if not have_same_tidx:
        userLabelInfo[uid]['labeled'].append(index)
        saveULI()

        infos = "USER {} DATA:{}(true:{}) SCORE:{}".format(uid, index, getTrueIdx(index), score)
        current_app.logger.warning(infos)
        print(infos)

    else:  # 放回可用位置
        availableDataIndex.append(index)

        infos = "Error 111 :( {}  {} ".format(uid, index)
        current_app.logger.info(infos)
        print(infos)

    return jsonify({"status": 200, "msg": "Data submit Success!"})


@app.route('/checkSignIn', methods = ['POST', 'GET'])
def checkSignIn():
    global allUsers
    uid = request.form.get('uid')
    pwd = request.form.get('pwd')
    with open('./static/userData/login.json', 'r') as f:
        allUsers = json.load(f)
    if allUsers.get(uid) is None:
        return json.dumps({"result": "NO"})
    else:
        if allUsers.get(uid) != pwd:
            return json.dumps({"result": "NO"})
        else:
            infos = "USER {} trying to sign in...".format(uid)
            current_app.logger.info(infos)
            print(infos)

            return json.dumps({"result": "YES"})


@app.route('/requestSample', methods = ['POST', 'GET'])
def requestSample():
    with open("./static/data/sample.json", "r", encoding = 'UTF-8') as f:
        sample = json.load(f)
    return json.dumps({"d": sample})


@app.route('/table_q1.html')
def renderTable1():
    return render_template('table_q1.html')


@app.route('/table_q2.html')
def renderTable2():
    return render_template('table_q2.html')


@app.route('/table_q3.html')
def renderTable3():
    return render_template('table_q3.html')


@app.route('/table_q4.html')
def renderTable4():
    return render_template('table_q4.html')


@app.route('/normal_problems.html')
def renderNormalQuests():
    return render_template('normal_problems.html')


@app.route('/labelPage.html')
def renderLabelPage():
    return render_template("labelPage.html")


@app.route('/Label.html')
def renderLabel():
    return render_template("Label.html")


@app.route('/')
def index():
    return render_template('index.html')


# 初始化将数据预先读入
def initialize(debug):
    global userLabelInfo
    global allDatas
    global availableDataIndex
    global userTimeStamp
    global timeLimit
    global num_times
    global checkExpiredTime
    global allUsers
    global tryData
    global submitTime

    with open("./static/userData/setting.json", "r") as f:
        try:
            tmp = json.load(f)
            timeLimit = tmp["timeOut"]
            num_times = tmp["labelPerData"]
            checkExpiredTime = tmp["checkExpired"]
        except JSONDecodeError:
            print("Fill the setting.json First!")
            exit(0)

    with open("./static/data/data.json", "r", encoding = 'UTF-8') as f:
        try:
            allDatas = json.load(f)
        except JSONDecodeError:
            print("You should put the data in file `./static/data/data/json`! ")
            exit(0)

    with open("./static/userData/login.json", "r") as f:
        allUsers = json.load(f)

    if debug:
        userLabelInfo = dict()
        availableDataIndex = list(range(len(allDatas) * num_times))
        userTimeStamp = dict()
        submitTime = dict()


    else:
        if os.path.exists("./static/userData/userLabelInfo.json"):
            with open("./static/userData/userLabelInfo.json", "r") as f:
                try:
                    userLabelInfo = json.load(f)
                except JSONDecodeError:
                    userLabelInfo = dict()
        else:
            userLabelInfo = dict()

        if os.path.exists("./static/userData/toLabelInfo.json"):
            with open("./static/userData/toLabelInfo.json", "r") as f:
                try:
                    availableDataIndex = json.load(f)
                except JSONDecodeError:
                    availableDataIndex = list(range(len(allDatas) * num_times))
        else:
            availableDataIndex = list(range(len(allDatas) * num_times))

        if os.path.exists("./static/userData/timeStamps.json"):
            with open("./static/userData/timeStamps.json", "r") as f:
                try:
                    userTimeStamp = json.load(f)
                except JSONDecodeError:
                    userTimeStamp = dict()
        else:
            userTimeStamp = dict()

        if os.path.exists("./static/userData/timeStamps.json"):
            with open("./static/userData/submitTime.json", "r") as f:
                try:
                    submitTime = json.load(f)
                except JSONDecodeError:
                    submitTime = dict()
        else:
            submitTime = dict()

    print("Data initializing Over!")


if __name__ == '__main__':
    initialize(False)

    scheduler = APScheduler()
    scheduler.add_job(func = checkExpired, id = '1', trigger = 'interval', seconds = checkExpiredTime)
    scheduler.init_app(app = app)
    scheduler.start()

    app.logger.setLevel(logging.INFO)
    formatter = logging.Formatter(
        "[%(asctime)s][%(filename)s:%(lineno)d][%(levelname)s][%(thread)d] - %(message)s")
    handler = TimedRotatingFileHandler(
        "flask.log", when = "D", interval = 1, backupCount = 15,
        encoding = "UTF-8", delay = False, utc = True)
    app.logger.addHandler(handler)
    handler.setFormatter(formatter)

    app.run(host = '0.0.0.0',  # 任何ip都可以访问
            port = 7777,  # 端口
            debug = True,
            use_reloader = False
            )
