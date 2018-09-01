const {SHA256} = require('crypto-js');
const jwt = require('jsonwebtoken');

var salt = 'somesecret';

var data = {
    id: 4
};

var token = jwt.sign(data, salt);
console.log(token);

var decoded = jwt.verify(token, salt);
console.log('decoded', decoded);
