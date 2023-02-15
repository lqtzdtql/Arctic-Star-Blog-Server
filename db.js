const mongoose = require('mongoose');
require('dotenv').config();

const connection = process.env.DB_CONNECTION;
mongoose.connect(connection, () => console.log('mongoose连接成功了！'));
mongoose.connection.on('error', console.error);
