const expect = require('expect');
const request = require('supertest');
const {app} = require('../server');
const {Todo} = require('../models/todo');

// empty mongo before each request
beforeEach((done) => {
    Todo.remove({}).then((res) => done(),
                         (err) => done(err));
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
                    expect(todos.length).toBe(1);
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
                expect(todos.length).toBe(0);
                done();
            }, (err) => done(err))
            .catch((reason) => done(reason));
        });
    })
});
