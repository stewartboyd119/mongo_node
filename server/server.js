const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');
var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');

const port = process.env.PORT || 3000;
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

app.get("/todos", (req, res) => {
    Todo.find({}).then((docs) => res.send({docs}),
        (err) => res.status(400).send(err));
})

// GET /todos/1232432432
app.get("/todos/:id", (req, res) => {
    var id = req.params.id;
    if (!ObjectID.isValid(id)) {
        return res.status(404).send();
    }
    console.log(id);
    Todo.findById(id).then(
        (todo) => {
            if (!todo) {
                return res.status(404).send({});
            }
            res.send({todo})
        },
        (err) => res.status(400).send()
    ).catch((reason) => res.status(400).send(`Crazy error ${reason}`));
})

app.listen(port, () => {
    console.log("server started");

});

module.exports.app = app;