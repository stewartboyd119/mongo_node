// const {SHA256} = require('crypto-js');
// const jwt = require('jsonwebtoken');

// var salt = 'somesecret';

// var data = {
//     id: 4
// };

// var token = jwt.sign(data, salt);
// console.log(token);

// var decoded = jwt.verify(token, salt);
// console.log('decoded', decoded);

const bcrpyt = require('bcryptjs');
var plainPassword = "abc123";

bcrpyt.genSalt(10, (error, salt) => {
    bcrpyt.hash(plainPassword, salt, (error2, hashedValue) => {
        console.log(hashedValue);
    })
});

var hashedPassword = '$2a$11$7KlzzIcrfJavmi6dgm7ia.2H9z0qW3IrZW9K3r3oYQd4sy5gsisuG';
bcrpyt.compare(plainPassword, hashedPassword, (error, doesMatch) => {
    console.log(`shit does match = ${doesMatch}`);
})