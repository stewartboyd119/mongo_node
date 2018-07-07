const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

// heroku env devines some variables that are only accessible to them. Check if exists and
// if not use local 
var dburl = process.env.MONGODB_URI;
mongoose.connect(dburl);

module.exports = {
    mongoose
}