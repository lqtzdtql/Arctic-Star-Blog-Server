const express = require('express');
// 定义路由级中间件
const router = express.Router();
// 引入数据模型模块
const Link = require('../models/link');

// 新增友链
router.post('/add', (req, res) => {
  const { title, des, avatar, link } = req.body;
  Link.create({ title, des, avatar, link })
    .then(data => {
      res.json({ data: `友链 ${data.data}(${data.link}) 添加成功` });
    })
    .catch(err => {
      res.json({ errMsg: err });
    });
});

// 删除友链
router.delete('/delete', (req, res) => {
  const { linkId } = req.query;
  Link.findByIdAndRemove(linkId)
    .then(data => {
      res.json({ data: `友链 ${data.data}(${data.link}) 删除成功` });
    })
    .catch(err => {
      res.json({ errMsg: err });
    });
});

// 获取全部友链
router.get('/get', (req, res) => {
  Link.find({})
    .sort({ create_at: -1 })
    .then(data => {
      res.json(data);
    })
    .catch(err => {
      res.json({ errMsg: err });
    });
});

module.exports = router;
