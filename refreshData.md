- 保存数据

  需要保存的内容包括：

  - ./static/data
  - ./static/userData

- 如果**只想更新数据**

  只更改./static/data/data.json即可

- 如果想**换数据**，让系统从头开始

  - 停止系统

  - 保存数据

  - 删除./static/data

  - 将./empty_templates/data内容完全复制到./static/data

    `cp -r ./empty_templates/data ./`

  - 将./static/data/data.json更新为新数据

  - 删除./static/userData下的`submitTime.json `  ` timeStamps.json`  `toLabelInfo.json`  `userLabelInfo.json`
  - 重新运行系统

