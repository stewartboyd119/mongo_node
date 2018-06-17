var {MongoClient, ObjectID} = require('mongodb');
const connectionString = "mongodb://localhost:27017";
const dbName = "TodoApp";
const todosCollection = "Todos";

MongoClient.connect(connectionString, (err, client) => {

    var db = client.db(dbName);
    db.collection(todosCollection).deleteMany({isCompleted: true}).then((result) => {

        console.log(result);
        client.close();
    }, (reason) => {
        console.log("This did not get deleted", reason);
    })
});