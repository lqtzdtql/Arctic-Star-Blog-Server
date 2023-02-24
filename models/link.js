const mongoose = require('mongoose');

const linkSchema = mongoose.Schema({
  title: { type: String },
  des: { type: String },
  avatar: { type: String },
  link: { type: String },
});

const Link = mongoose.model('Link', linkSchema);

module.exports = Link;
