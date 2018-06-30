const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

var dburl = "mongodb://localhost:27017/TodoApp";
mongoose.connect(dburl);

module.exports = {
    mongoose
}