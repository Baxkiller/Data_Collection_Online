# from flask import Flask, jsonify
# from flask_apscheduler import APScheduler
# from datetime import datetime
#
# app = Flask(__name__)
# scheduler = APScheduler()
#
#
# def my_job():
#     print(datetime.now().strftime('%Y-%m-%d %H:%M:%S'))
#
#
# @app.route('/update')
# def update():
#     my_job()
#     return jsonify({'code': 0, 'data': 'update'})
#
#
# @app.route('/extraction', methods = ['post'])
# def extraction():
#     return jsonify({'code': 0, 'data': 'extraction'})
#
#
# if __name__ == "__main__":
#     # 定时任务
#     scheduler.add_job(func = my_job, id = '1', trigger = 'interval', seconds = 10)
#     scheduler.init_app(app = app)
#     scheduler.start()
#     app.run(debug = False, host = '0.0.0.0', port = 10002)

a = [1, 2, 3, 4]
a.remove(4)
print(a)
a.remove(5)
print(a)