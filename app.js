require('./db');
const express = require('express');
const app = express();

const series = require('./routes/series');
const article = require('./routes/article');
const tag = require('./routes/tag');
const notice = require('./routes/notice');
const view = require('./routes/view');
const cors = require('cors');

app.use(cors());
app.use(express.json());

app.use('/api/series', series);
app.use('/api/article', article);
app.use('/api/tag', tag);
app.use('/api/notice', notice);
app.use('/api/view', view);
app.use('/', (req, res) => {
  res.send('hhh');
});

app.listen(4000, () => {
  console.log('server is running at http://127.0.0.1:4000');
});
