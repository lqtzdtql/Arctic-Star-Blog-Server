const mongoose = require('mongoose');

const tagSchema = mongoose.Schema({
  name: { type: String },
  article: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'Article',
  },
  create_at: { type: Number },
});

const Tag = mongoose.model('Tag', tagSchema);

module.exports = Tag;
