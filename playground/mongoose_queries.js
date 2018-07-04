const {ObjectID} = require('mongodb');
const {mongoose} = require('../server/db/mongoose');
const {Todo} = require('../server/models/todo');
const {User} = require('../server/models/user');



var id = '5b3ac86c6d7d1e16678ece35';
if (!ObjectID.isValid(id)) {
    console.log("objectid is not valid");
}
var t = new Todo({a: 1});
// user find by id
// 
User.findById(id).then((user) => {
        if (!user) {
            return console.log("No user found");
        }
        console.log("User", user);
    },
    (err) => console.log("Error occurred", err)
).catch((reason) => console.log("Some extra bullshit occurred", reason));