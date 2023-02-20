const mongoose = require('mongoose');

const viewSchema = mongoose.Schema({
  view: { type: Number },
});

const View = mongoose.model('View', viewSchema);

module.exports = View;
