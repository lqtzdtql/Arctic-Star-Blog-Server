// 引入express模块
const express = require('express');
// 定义路由级中间件
const router = express.Router();
// 引入数据模型模块
const Series = require('../models/series');
const Article = require('../models/article');

// 新增合集
router.post('/add', (req, res) => {
  const { seriesName } = req.body;
  const createAt = Date.parse(new Date());
  Series.create({ name: seriesName, article: [], create_at: createAt })
    .then(series => {
      res.json({ status: 1, data: `合集 ${series.name} 创建成功` });
    })
    .catch(err => {
      res.json({ status: 0, errMsg: err });
    });
});

// 删除合集
router.delete('/delete', (req, res) => {
  const { seriesId } = req.query;
  Series.findOneAndRemove({ _id: seriesId })
    .then(series => {
      const promiseArr = [];
      for (const i of series.article) {
        promiseArr.push(Article.findByIdAndUpdate(i, { $pull: { series: seriesId } }));
      }
      Promise.all(promiseArr)
        .then(data => {
          res.json({ status: 1, data: `合集 ${series.name} 删除成功` });
        })
        .catch(err => {
          res.json({ status: 0, errMsg: err });
        });
    })
    .catch(err => {
      res.json({ status: 0, errMsg: err });
    });
});

// 修改合集名称
router.put('/modify/name', (req, res) => {
  const { seriesId } = req.query;
  const { seriesName } = req.body;
  Series.findOneAndUpdate({ _id: seriesId }, { $set: { name: seriesName } }, {})
    .then(series => {
      res.json({ status: 1, data: `合集 ${series.name} 名称已修改为 ${seriesName}` });
    })
    .catch(err => {
      res.json({ status: 0, errMsg: err });
    });
});

// 查询所有合集
router.get('/get/allSeries', (req, res) => {
  Series.find({}, { name: 1 })
    .sort({ create_at: -1 })
    .then(data => {
      res.json({ status: 1, data });
    })
    .catch(err => {
      res.json({ status: 0, errMsg: err });
    });
});

// 查询合集中文章
router.get('/get/articlesInSeries', (req, res) => {
  const { seriesId, count, page } = req.query;
  Series.findById(seriesId, { name: 1, article: 1 })
    .skip((page - 1) * count)
    .limit(count)
    .populate({
      path: 'article',
      select: { title: 1, series: 1, tag: 1, create_at: 1 },
      populate: [
        { path: 'series', select: { name: 1 } },
        { path: 'tag', select: { name: 1 } },
      ],
      options: { sort: { create_at: -1 } },
    })
    .then(data => {
      res.json({ status: 1, data });
    })
    .catch(err => {
      res.json({ status: 0, errMsg: err });
    });
});

// 获取合集中文章总数
router.get('/get/totalInSeries', (req, res) => {
  const { seriesId } = req.query;
  Series.findById(seriesId)
    .then(data => {
      res.json({ status: 1, total: data.article.length });
    })
    .catch(err => {
      res.json({ status: 0, errMsg: err });
    });
});

module.exports = router;
