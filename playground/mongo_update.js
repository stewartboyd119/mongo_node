const {MongoClient, ObjectID} = require("mongodb");

const connectionString = "mongodb://localhost:27017";
const dbName = "TodoApp";
const todosCollection = "Todos";
const userCollection = "Users";


MongoClient.connect(connectionString, (err, client) => {
    var db = client.db(dbName);
    db.collection(userCollection).findOneAndUpdate({ user: "Michael"}, {$inc: {age: -10}, $set: {location: "shug"}}, {returnOriginal: false})
    .then((result) => {
        console.log("Updated shit", result);
        client.close();
    })
});