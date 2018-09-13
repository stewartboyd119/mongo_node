const expect = require('expect');
const request = require('supertest');
const {app} = require('./../server');
const {Todo} = require('./../models/todo');
var {User} = require('./../models/user');
const {ObjectID} = require('mongodb');
const {seedTodos, seedUsers, populateTodos, populateUsers} = require('./seed/seed')

// empty mongo before each request
beforeEach(populateTodos);
beforeEach(populateUsers);
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
        request(app)
        .delete(url)
        .expect(200)
        .expect((res) => {
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

describe("GET /users/me", () => {
    it("should retrieve user info when a valid token is given", (done) => {
        request(app)
        .get('/users/me')
        .set('x-auth', seedUsers[0].tokens[0].token)
        .expect('Content-Type', /json/)
        .expect(200)
        .expect((res) => {
            expect(res.body).toEqual({
                "_id": seedUsers[0]._id.toHexString(),
                "email": seedUsers[0].email
            })
        })
        .end(done);
    });

    it("should send 401 when an invalid token is given", (done) => {
        const invalidToken = "123" + seedUsers[0].tokens[0].token;
        request(app)
        .get('/users/me')
        .set('x-auth', invalidToken)
        .expect(401)
        .end(done);

    });
})

describe("POST /users/login", () => {
    it("should get back user info when valid credentials are given", (done) => {
        var email = seedUsers[0].email;
        var password = seedUsers[0].password;
        request(app)
        .post('/users/login')
        .send({email, password})
        .expect(200)
        .expect((res) => {
            expect(res.headers['x-auth']).toBeTruthy();
            expect(res.body._id).toBeTruthy();
            expect(res.body.email).toEqual(email);
        })
        .end(done);
    });
    it("send a 400 when invalid user/password combo is given", (done) => {
        var email = "fake@email.com";
        var password = "dsfdsfds!";
        request(app)
        .post('/users/login')
        .send({email, password})
        .expect(400)
        .end(done);
    });
})

describe("POST /users", () => {
    it("should create a user", (done) => {

        var email = "example@email.com";
        var password = "abc123!";
        request(app)
        .post('/users')
        .send({email, password})
        .expect(200)
        .expect((res) => {
            expect(res.headers['x-auth']).toBeTruthy();
            expect(res.body._id).toBeTruthy();
            expect(res.body.email).toEqual(email);
        })
        .end((err) => {
            if (err) {
                // call done with err so test fails
                done(err);
            } else {
                //done();
                //query db and confirm user exists there now
                User.findOne({email}, (err, user) => {
                    expect(user.email).toEqual(email);
                    // password should have been hashed so they shouldnt be equal
                    expect(user.password).not.toBe(password);
                    done();
                });
            }
        });
    })
    it("should return validation errors if requeest invalid", (done) => {
        var email = '';
        var password = "abc123!";
        request(app)
        .post('/users')
        .send({email, password})
        .expect(400)
        .end(done);

    })
    it("should not create user if email in use", (done) => {
        var email = seedUsers[0].email;
        var password = seedUsers[0].password;
        request(app)
        .post('/users')
        .send({email, password})
        .expect(400)
        .end(done);

    })
})