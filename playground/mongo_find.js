const {MongoClient, ObjectID} = require("mongodb");

const connectionString = "mongodb://localhost:27017";
const dbName = "TodoApp";
const todosCollection = "Todos";

MongoClient.connect(connectionString, (err, client) => {
    if (err) {
        return console.log("Error connection", err);
    }
    var db = client.db(dbName);
    var result = db.collection(todosCollection).find({}).toArray( (err, res) => {
        if (err) return console.log("Error on find", err);
        console.log(res);
        client.close();
    });
})