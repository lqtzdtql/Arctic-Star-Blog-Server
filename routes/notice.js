// 引入express模块
const express = require('express');
// 定义路由级中间件
const router = express.Router();
// 引入数据模型模块
const Notice = require('../models/notice');

// 更新公告
router.post('/add', (req, res) => {
  const { text } = req.body;
  const createAt = Date.parse(new Date());
  Notice.create({ text, create_at: createAt })
    .then(series => {
      res.json({ data: `公告更新成功` });
    })
    .catch(err => {
      res.json({ errMsg: err });
    });
});

// 获取最新公告
router.get('/get', (req, res) => {
  Notice.find({})
    .sort({ create_at: -1 })
    .limit(1)
    .then(data => {
      res.json(data);
    })
    .catch(err => {
      res.json({ errMsg: err });
    });
});

module.exports = router;
