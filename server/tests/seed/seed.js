
const {ObjectID} = require('mongodb');
const {Todo} = require('./../../models/todo');

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
const populateTodos = (done) => {
    Todo.remove({}).then((res) => done(),
                         (err) => done(err));
    Todo.insertMany(seedTodos);
} 
module.exports = {seedTodos, populateTodos};