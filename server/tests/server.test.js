const expect = require('expect');
const request = require('supertest');
const {app} = require('../server');
const {Todo} = require('../models/todo');
const {ObjectID} = require('mongodb');

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
// empty mongo before each request
beforeEach((done) => {
    Todo.remove({}).then((res) => done(),
                         (err) => done(err));
    Todo.insertMany(seedTodos);
});
describe('POST /todos', () => {
    it('should respond with json', (done) => {
        const text = "test2";
        request(app)
        .post('/todos')
        .send({text})
        .expect('Content-Type', /json/)
        .expect(200)
        .expect((res)=> {
            expect(res.body.text).toEqual(text);
        })
        .end((err, res) => {
            if (err) {
                return done(err);
            }
            Todo.find().then(
                (todos) => {
                    // console.log("test");
                    // console.log(todos);
                    // console.log("*****");
                    // console.log(todos[0]);
                    // console.log(todos[1]);
                    // console.log(todos.length);
                    expect(todos[todos.length - 1].text).toBe(text);
                    expect(todos.length).toBe(7);
                    return done();
            }, 
                (err) => done(err))
            .catch((err) => done(err));  
        });
    });

    it('should not create todo', (done) => {
        const badfield = "badfield";
        request(app)
        .post('/todos')
        .send({badfield})
        .expect(400)
        .end((err, res) => {
            if (err) {
                return done(err);
            }
            Todo.find().then((todos) => {
                expect(todos.length).toBe(6);
                done();
            }, (err) => done(err))
            .catch((reason) => done(reason));
        });
    });
});


describe("GET /todos/:id", () => {
    it("should return todo", (done) => {
        var url = `/todos/${seedTodos[0]._id.toHexString()}`;
        console.log(url);
        request(app)
        .get(url)
        .expect(200)
        .expect((res) => {
            expect(res.body.todo._id).toBe(seedTodos[0]._id.toHexString());
            expect(res.body.todo.text).toBe(seedTodos[0].text);
        })
        .end(done);
    });
    it("should return 404 when an invalid ID is given", (done) => {
        request(app)
        .get(`/todos/123`)
        .expect(404)
        .end(done);
    });
    it("should return a 404 when a non existant ID is given", (done) => {
        request(app)
        .get('/todos/1b3ac86c6d7d1e16678ece31')
        .expect(404)
        .end(done);
    });
});

describe("DELETE /todos/:id", () => {
    it("should return delete a todo", (done) => {
        var id = seedTodos[0]._id.toHexString();
        var url = `/todos/${id}`;
        console.log(url);
        request(app)
        .delete(url)
        .expect(200)
        .expect((res) => {
            //console.log(res);
            expect(res.body.todo._id).toBe(seedTodos[0]._id.toHexString());
            expect(res.body.todo.text).toBe(seedTodos[0].text);
        })
        .end((err, res) => {
            Todo.findById(id).then((todo) => {
                expect(todo).toBeFalsy();
                done();
                },
                (err) => done(err))
                .catch((reason) => done(reason));
        });
    });
    it("should return 404 when an invalid ID is given for deletion", (done) => {
        request(app)
        .delete(`/todos/123`)
        .expect(404)
        .end(done);
    });
    it("should return a 404 when a non existant ID is given for deletion", (done) => {
        request(app)
        .delete('/todos/1b3ac86c6d7d1e16678ece31')
        .expect(404)
        .end(done);
    });
});
describe("PATCH /todos/:id", () => {

    it("should update the todo", (done) => {
        var body = {text: "hello world"};
        var id = seedTodos[0]._id.toHexString();
        request(app)
        .patch(`/todos/${id}`)
        .send(body)
        .expect(200)
        .end((err, res) => {
            Todo.findById(id).then((todo) => {
               expect(todo.text).toBe(body.text); 
               done();
            }, (err) => done(err))
            .catch((reason) => done(reason));
        })
    });

    it("should clear completed at when completed set to false", (done) => {
        var body = {text: "hello world", completed: false};
        var id = seedTodos[0]._id.toHexString();
        request(app)
        .patch(`/todos/${id}`)
        .send(body)
        .expect(200)
        .end((err, res) => {
            Todo.findById(id).then((todo) => {
               expect(todo.text).toBe(body.text); 
               expect(todo.completed).toBeFalsy();
               // shouldnt be set since completed was set to false
               expect(todo.completedAt).toBeFalsy();
               console.log(todo.completedAt);

               done();
            })
            .catch((reason) => done(reason));
        });
    });
});

describe("GET /todos", () => {
    it("Get all docs", (done) => {
        request(app)
        .get('/todos')
        .expect(200)
        .expect((res) => {
            expect(res.body.docs.length).toBe(6);
        })
        .end(done);
    });
});