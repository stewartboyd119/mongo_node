const {MongoClient, ObjectID} = require("mongodb");

const connectionString = "mongodb://localhost:27017";
const dbName = "TodoApp";
const todosCollection = "Users";

MongoClient.connect(connectionString, (err, client) => {
    if (err) {
        return console.log("Error connection", err);
    }
    var db = client.db(dbName);
    var result = db.collection(todosCollection).find({user: "Michael"}).toArray().then((res) => {
        console.log(JSON.stringify(res, undefined, 2));
        //client.close();
    }, (err) => {
        return console.log("Error on find", err);
        //client.close();
    });
    db.collection(todosCollection).find({}).count().then((number) => {
        console.log(`The count was ${number}`);
    })
})