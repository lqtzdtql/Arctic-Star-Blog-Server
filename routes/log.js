const express = require('express');
// 定义路由级中间件
const router = express.Router();
// 引入数据模型模块
const Log = require('../models/log');

// 新增日志
router.post('/add', (req, res) => {
  const { logContent } = req.body;
  const date = Date.parse(new Date());
  Log.create({ logContent, date })
    .then(data => {
      res.json({ data: `日志添加成功` });
    })
    .catch(err => {
      res.json({ errMsg: err });
    });
});

// 删除日志
router.delete('/delete', (req, res) => {
  const { logId } = req.query;
  Log.findByIdAndRemove(logId)
    .then(data => {
      res.json({ data: `日志删除成功` });
    })
    .catch(err => {
      res.json({ errMsg: err });
    });
});

// 获取全部日志
router.get('/get', (req, res) => {
  Log.find({})
    .sort({ create_at: -1 })
    .then(data => {
      res.json(data);
    })
    .catch(err => {
      res.json({ errMsg: err });
    });
});

module.exports = router;
