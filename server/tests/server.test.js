const expect = require('expect');
const request = require('supertest');
const {app} = require('../server');
const {Todo} = require('../models/todo');
const {ObjectID} = require('mongodb');

const seedTodos = [
    {text: "todo1",
    _id: new ObjectID()},
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
    it('respond with json', (done) => {
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
                    expect(todos[todos.length - 1].text).toBe(text);
                    expect(todos.length).toBe(7);
                    return done();
            }, 
                (err) => done(err))
            .catch((err) => done(err));  
        });
    });
    it('does not create todo', (done) => {
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
    it("Get a todo with a valid id", (done) => {
        var url = `/todos/${seedTodos[0]._id.toHexString()}`;
        console.log(url);
        request(app)
        .get(url)
        .expect(200)
        .expect((res) => {
            console.log(res);
            expect(res.body.todo._id).toBe(seedTodos[0]._id.toHexString());
            expect(res.body.todo.text).toBe(seedTodos[0].text);
        })
        .end(done);
    });
    it("Try to get a doc with an invalid ID", (done) => {
        request(app)
        .get(`/todos/123`)
        .expect(404)
        .end(done);
    });
    it("Try to get a doc with a valid id that doesnt exist", (done) => {
        request(app)
        .get('/todos/1b3ac86c6d7d1e16678ece31')
        .expect(404)
        .end(done);
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