const mongoose = require('mongoose');

const noticeSchema = mongoose.Schema({
  text: { type: String },
  create_at: { type: Number },
});

const Notice = mongoose.model('Notice', noticeSchema);

module.exports = Notice;
