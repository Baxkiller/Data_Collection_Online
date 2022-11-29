# -*- codeing = utf-8 -*-
# @Time       : 2022/11/29 20:15
# @Author     : Baxkiller
# @File       : test.py
# @Software   : PyCharm
# @Description:
import json
import numpy as np

with open("./static/data/data.json", "r") as f:
    data = json.load(f)

arr = list(range(len(data)))
np.random.shuffle(data)
test_data = data[0:20]

with open("./static/data/data.json","w") as f:
    json.dump(test_data,f)