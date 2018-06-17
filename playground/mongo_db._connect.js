const MongoClient = require('mongodb').MongoClient;
MongoClient.connect('mongodb://localhost:27017', (err, client) => {
    if (err) {
        return console.log("Unable to connect to mongodb", err);
    }
    console.log("Connected to database");
    var dbase = client.db('TodoApp');

    /*
        dbase.collection('Users').insertOne({
        text: "tthis is the second note",
        isCompleted: true
    }, (err, res) => {
        if (err) {
            console.log("Error", err);
        } else {
            console.log("Added record", res.ops);
        }
    });
    */
    // insert into Users collection (name, age, location)
    dbase.collection('Users').insertOne({
        user: "Stewart Boyd",
        age: 123,
        location: "Reno, Nevada"
    }, (err, res) => {
        if (err) {
            return console.log("Error", err);
        }
        console.log("Added record", res.ops);
    })
    client.close();
})