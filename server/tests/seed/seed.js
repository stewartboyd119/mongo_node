
const {ObjectID} = require('mongodb');
const jwt = require('jsonwebtoken');
const {Todo} = require('./../../models/todo');
const {User} = require('./../../models/user');

const seedTodos = [
    {text: "todo1",
    _id: new ObjectID(),
    completed: true,
    completedAt: 234},
    {text: "todo2"},
    {text: "todo3"},
    {text: "todoj"},
    {text: "todo5"},
    {text: "todo6"}
]

const user1I = new ObjectID();
const user2Id = new ObjectID();
const seedUsers = [
    {
        _id: user1I,
        email: "sboyd@gmail.edu",
        password: "password",
        tokens: [
            {token: jwt.sign({_id: user1I, access: 'auth'}, 'abc123').toString(),
            access:  'auth'}
        ]
    },
    {
        _id: user2Id,
        email: "jen@example.edu",
        password: "user2pass",
        tokens: [
            {token: jwt.sign({_id: user2Id, access: 'auth'}, 'abc123').toString(),
            access:  'auth'}
        ]
    }
]
const populateTodos = (done) => {
    Todo.remove({}).then((res) => done(),
                         (err) => done(err));
    Todo.insertMany(seedTodos);
} 

const populateUsers = (done) => {
    // remove all users
    User.remove({}).then((res) => {
        var user1 = new User(seedUsers[0]).save();
        var user2 = new User(seedUsers[1]).save();
        return Promise.all([user1, user2])
    }).then(() => done()) ;
} 
module.exports = {seedTodos, seedUsers, populateTodos, populateUsers};