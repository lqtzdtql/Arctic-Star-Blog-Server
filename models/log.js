const mongoose = require('mongoose');

const logSchema = mongoose.Schema({
  date: { type: Number },
  logContent: { type: [String] },
});

const Log = mongoose.model('Log', logSchema);

module.exports = Log;
