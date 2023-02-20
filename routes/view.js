// 引入express模块
const express = require('express');
// 定义路由级中间件
const router = express.Router();
// 引入数据模型模块
const View = require('../models/view');

let tempView = 0;

// 获取浏览量
router.get('/get', (req, res) => {
  View.find({})
    .then(data => {
      tempView = Math.max(tempView, data[0].view) + 1;
      res.json({ view: tempView });
    })
    .catch(err => {
      res.json({ errMsg: err });
    });
});

setInterval(() => {
  View.findOneAndUpdate({ $set: { view: tempView } }).then(data => {
    console.log('浏览量已更新');
  });
}, 60 * 1000);

module.exports = router;
