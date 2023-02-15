const mongoose = require('mongoose');

const connection = 'mongodb+srv://admin:a3338382@cluster0.gjvakm0.mongodb.net/?retryWrites=true&w=majority';
mongoose.connect(connection, () => console.log('mongoose连接成功了！'));
mongoose.connection.on('error', console.error);
