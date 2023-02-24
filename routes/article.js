// 引入express模块
const express = require('express');
// 定义路由级中间件
const router = express.Router();
// 引入数据模型模块
const Article = require('../models/article');
const Series = require('../models/series');
const Tag = require('../models/tag');

const arrTool = require('../tool/arrTool');

const articleViewsMap = new Map();
setInterval(() => {
  articleViewsMap.forEach((value, key) => {
    Article.findByIdAndUpdate(key, { $set: { view: value } }).then(console.log('文章浏览量已更新'));
  });
}, 60 * 1000);

// 新增文章
router.post('/add', (req, res) => {
  const { title, series, tag, text } = req.body;
  const createAt = Date.parse(new Date());
  const article = {
    title,
    series: [series],
    tag,
    create_at: createAt,
    content: text.slice(0, 200),
    text,
    view: 0,
  };
  Article.create(article)
    .then(article => {
      Series.findByIdAndUpdate(series, { $push: { article: article._id } })
        .then(data => {
          const promiseArr = [];
          for (const i of tag) {
            promiseArr.push(Tag.findByIdAndUpdate(i, { $push: { article: article._id } }));
          }
          Promise.all(promiseArr)
            .then(data => {
              res.json({ data: `文章 ${article.title} 创建成功` });
            })
            .catch(err => {
              res.json({ errMsg: err });
            });
        })
        .catch(err => {
          res.json({ errMsg: err });
        });
    })
    .catch(err => {
      res.json({ errMsg: err });
    });
});

// 删除文章（根据文章id）
router.delete('/delete', (req, res) => {
  const { articleId } = req.query;
  Article.findByIdAndRemove(articleId)
    .then(article => {
      const { title, series, tag } = article;
      Series.findByIdAndUpdate(series[0], { $pull: { article: articleId } })
        .then(data => {
          const promiseArr = [];
          for (const i of tag) {
            promiseArr.push(Tag.findByIdAndUpdate(i, { $pull: { article: articleId } }));
          }
          Promise.all(promiseArr)
            .then(data => {
              res.json({ data: `文章 ${title} 删除成功` });
            })
            .catch(err => {
              res.json({ errMsg: err });
            });
        })
        .catch(err => {
          res.json({ errMsg: err });
        });
    })
    .catch(err => {
      res.json({ errMsg: err });
    });
});

// 修改文章
router.post('/modify', (req, res) => {
  const { articleId } = req.query;
  const { title, series, tag, text } = req.body;
  Article.findByIdAndUpdate(articleId, { $set: { title, series, tag, text, content: text.slice(0, 100) } })
    .then(article => {
      const { series: oldSeries, tag: oldTag } = article;
      const promiseArr = [];
      if (series !== oldSeries[0]) {
        promiseArr.push(Series.findByIdAndUpdate(oldSeries[0], { $pull: { article: articleId } }));
        promiseArr.push(Series.findByIdAndUpdate(series, { $push: { article: articleId } }));
      }
      const allHadTagArr = arrTool.intersection(tag, oldTag);
      const needAddTagArr = arrTool.difference(tag, allHadTagArr);
      const needDeleteTagArr = arrTool.difference(oldTag, allHadTagArr);
      for (const i of needAddTagArr) {
        promiseArr.push(Tag.findByIdAndUpdate(i, { $push: { article: articleId } }));
      }
      for (const i of needDeleteTagArr) {
        promiseArr.push(Tag.findByIdAndUpdate(i, { $pull: { article: articleId } }));
      }
      Promise.all(promiseArr)
        .then(data => {
          res.json({ data: `文章 ${title} 修改成功` });
        })
        .catch(err => {
          res.json({ errMsg: err });
        });
    })
    .catch(err => {
      res.json({ errMsg: err });
    });
});

// 获取所有文章信息（不包括正文）
router.get('/get/allArticles', (req, res) => {
  const { count, page } = req.query;
  Article.find({}, { title: 1, series: 1, tag: 1, content: 1, create_at: 1 })
    .skip((page - 1) * count)
    .limit(count)
    .populate('series', { name: 1 })
    .populate('tag', { name: 1 })
    .sort({ create_at: -1 })
    .then(data => {
      res.json({ data, pageData: { count, page } });
    })
    .catch(err => {
      res.json({ errMsg: err });
    });
});

// 根据id获取文章详细信息
router.get('/get/articleById', (req, res) => {
  const { articleId } = req.query;
  Article.findById(articleId, { title: 1, series: 1, tag: 1, text: 1, create_at: 1, view: 1 })
    .populate('series', { name: 1 })
    .populate('tag', { name: 1 })
    .then(data => {
      articleViewsMap.set('' + data._id, (articleViewsMap.get('' + data._id) || data.view) + 1);
      data.view = articleViewsMap.get('' + data._id);
      res.json(data);
    })
    .catch(err => {
      res.json({ errMsg: err });
    });
});

// 模糊查询文章
router.get('/get/articleByString', (req, res) => {
  const { count, page, target } = req.query;
  Article.find({ $or: [{ title: { $regex: target } }, { text: { $regex: target } }] }, { title: 1, create_at: 1 })
    .skip((page - 1) * count)
    .limit(count)
    .sort({ create_at: -1 })
    .then(data => {
      res.json({ data, pageData: { count, page } });
    })
    .catch(err => {
      res.json({ errMsg: err });
    });
});

// 获取文章总数
router.get('/get/total', (req, res) => {
  Article.find({})
    .then(data => {
      res.json({ total: data.length });
    })
    .catch(err => {
      res.json({ errMsg: err });
    });
});

module.exports = router;
