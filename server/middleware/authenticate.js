var {User} = require('../models/user');


// add middle ware for authentication
var authenticate = (req, res, next) => {

    var token = req.header('x-auth');
    var user = User.findByToken(token).then((user) => {
        if (!user) {
            return Promise.reject();
        }
        req.user = user;
        req.token = token;
        // call next so that route function is called after this 
        // function completes
        next();
    })
    .catch((e) => {
        // 401 indicates that authentication is required
        res.status(401).send();
    })
}

module.exports = {authenticate};