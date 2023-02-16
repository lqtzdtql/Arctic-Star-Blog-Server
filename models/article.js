const mongoose = require('mongoose');

const articleSchema = mongoose.Schema({
  title: { type: String },
  series: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'Series',
  },
  tag: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'Tag',
  },
  create_at: { type: String },
  content: { type: String },
  text: { type: String },
  view: { type: Number },
});

const Article = mongoose.model('Article', articleSchema);

module.exports = Article;
