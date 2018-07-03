const expect = require('expect');
const request = require('supertest');
const {app} = require('../server');
const {Todo} = require('../models/todo');

const seedTodos = [
    {text: "todo1"},
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


describe("GET /todos", () => {
    it("Get all docs", (done) => {
        request(app)
        .get('/todos')
        .expect(200)
        .end((err, res) => {
            if (err) {
                return done(err);
            }
            expect(res.body.docs.length).toBe(6);
            done();
        });
    });
});