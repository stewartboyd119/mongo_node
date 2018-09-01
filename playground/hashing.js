const {SHA256} = require('crypto-js');
var message = "I am the message";
var hash = SHA256(message);
console.log(`message ${message} and hash=${hash}`);

var salt = 'somesecret';

var data = {
    id: 4
};
var token = {
    data, 
    hash: SHA256(JSON.stringify(data) + salt).toString()
};

token.data.id = 5;
var resultHash = SHA256(JSON.stringify(token.data) + salt).toString();

if (resultHash === token.hash) {
    console.log('data was not changed');
} else {
    console.log('data was changed dont trust');
}

