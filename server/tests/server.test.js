const expect = require('expect');
const request = require('supertest');
const {app} = require('../server');
const {Todo} = require('../models/todo');

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
                    expect(todos.length).toBe(1);
                    expect(todos[0]).toBe(text);
                    return done();
            }, 
                    (err) => done(err))
        })
        .catch((err) => done(err));
    });
});
