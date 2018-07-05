const {ObjectID} = require('mongodb');
const {mongoose} = require('../server/db/mongoose');
const {Todo} = require('../server/models/todo');
const {User} = require('../server/models/user');

/*
Todo.remove({}).then((result) => console.log(result),
    (err) => console.log(err)
);
*/

Todo.findByIdAndRemove('5b3dff8613af481c79ab96b2').then((todo) => console.log(todo),
    (err) => console.log(err));