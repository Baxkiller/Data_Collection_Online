# -*- codeing = utf-8 -*-
# @Time       : 2022/11/29 20:15
# @Author     : Baxkiller
# @File       : test.py
# @Software   : PyCharm
# @Description:
import json
import numpy as np

with open("./static/data/dstc10_topical_clean_eval_labeling.json", "r") as f:
    data = json.load(f)

np.random.shuffle(data)
tmp=len(data[0:20])
with open("./static/data/data.json", "w") as f:
    json.dump(data[0:20], f)
