const {MongoClient, ObjectID} = require("mongodb");

const connectionString = "mongodb://localhost:27017";
const dbName = "TodoApp";
const todosCollection = "Todos";


MongoClient.connect(connectionString, (err, client) => {
    var db = client.db(dbName);
    db.collection(todosCollection).findOneAndUpdate({ text: "I love Lydia"}, {isCompleted: false, text: "I love Lydiaaaaaa"}).then((result) => {
        console.log("Updated shit", result);
        client.close();
    })
});