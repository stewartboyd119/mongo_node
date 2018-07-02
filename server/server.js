const express = require('express');
const bodyParser = require('body-parser');
var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');
console.log(global.Promise);

var app = express();

//json() method returns a function
app.use(bodyParser.json());
app.post("/todos", (req, res) => {
    console.log(req.body);
    var todoNew = new Todo({
        text: req.body.text
    });
    todoNew.save().then((doc) => {
        console.log(`doc=${doc}`);
        res.send(doc);
    }, (e) => {
        res.status(400).send(e);
    })
});

app.listen(3000, () => {
    console.log("server started");

});

module.exports.app = app;