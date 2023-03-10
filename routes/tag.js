const express = require('express');
// 定义路由级中间件
const router = express.Router();
// 引入数据模型模块
const Tag = require('../models/tag');
const Article = require('../models/article');

// 新增标签
router.post('/add', (req, res) => {
  const { tagName } = req.body;
  const createAt = Date.parse(new Date());
  Tag.create({ name: tagName, article: [], create_at: createAt })
    .then(tag => {
      res.json({ data: `标签 ${tag.name} 创建成功` });
    })
    .catch(err => {
      res.json({ errMsg: err });
    });
});

// 删除标签
router.delete('/delete', (req, res) => {
  const { tagId } = req.query;
  Tag.findOneAndRemove({ _id: tagId })
    .then(tag => {
      const promiseArr = [];
      for (const i of tag.article) {
        promiseArr.push(Article.findByIdAndUpdate(i, { $pull: { tag: tagId } }));
      }
      Promise.all(promiseArr)
        .then(data => {
          res.json({ data: `标签 ${tag.name} 删除成功` });
        })
        .catch(err => {
          res.json({ errMsg: err });
        });
    })
    .catch(err => {
      res.json({ errMsg: err });
    });
});

// 修改标签名称
router.put('/modify/name', (req, res) => {
  const { tagId } = req.query;
  const { tagName } = req.body;
  Tag.findOneAndUpdate({ _id: tagId }, { $set: { name: tagName } })
    .then(tag => {
      res.json({ data: `标签 ${tag.name} 名称已修改为 ${tagName}` });
    })
    .catch(err => {
      res.json({ errMsg: err });
    });
});

// 查询所有标签
router.get('/get/allTags', (req, res) => {
  Tag.find({}, { name: 1 })
    .sort({ create_at: -1 })
    .then(data => {
      res.json(data);
    })
    .catch(err => {
      res.json({ errMsg: err });
    });
});

// 查询标签下文章
router.get('/get/articlesInTag', (req, res) => {
  const { tagId } = req.query;
  Tag.findById(tagId, { name: 1, article: 1 })
    .populate({
      path: 'article',
      select: { title: 1, create_at: 1 },
      // populate: [
      //   { path: 'series', select: { name: 1 } },
      //   { path: 'tag', select: { name: 1 } },
      // ],
      options: { sort: { create_at: -1 } },
    })
    .then(data => {
      res.json(data);
    })
    .catch(err => {
      res.json({ errMsg: err });
    });
});

// 获取标签下文章总数
router.get('/get/totalInTag', (req, res) => {
  const { tagId } = req.query;
  Tag.findById(tagId)
    .then(data => {
      res.json({ total: data.article.length });
    })
    .catch(err => {
      res.json({ errMsg: err });
    });
});

// 获取标签总数
router.get('/get/total', (req, res) => {
  Tag.find({})
    .then(data => {
      res.json({ total: data.length });
    })
    .catch(err => {
      res.json({ errMsg: err });
    });
});

module.exports = router;
