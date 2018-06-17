const {MongoClient, ObjectId} = require('mongodb');
MongoClient.connect('mongodb://localhost:27017', (err, client) => {
    if (err) {
        return console.log("Unable to connect to mongodb", err);
    }
    console.log("Connected to database");
    var dbase = client.db('TodoApp');

        dbase.collection('Todos').insertOne({
        text: "Alpna",
        isCompleted: false
    }, (err, res) => {
        if (err) {
            console.log("Error", err);
        } else {
            console.log("Added record", res.ops);
            client.close();
        }
    });
    /*
    // insert into Users collection (name, age, location)
    dbase.collection('Users').insertOne({
        user: "Stewart Boyd",
        age: 123,
        location: "Reno, Nevada"
    }, (err, res) => {
        if (err) {
            return console.log("Error", err);
        }
        console.log("Added record", res.ops[0]._id.getTimestamp());
    })
    client.close();
    */
})