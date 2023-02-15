const mongoose = require('mongoose');

const seriesSchema = mongoose.Schema({
  name: { type: String },
  article: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'Article',
  },
  create_at: { type: Number },
});

const Series = mongoose.model('Series', seriesSchema);

module.exports = Series;
