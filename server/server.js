const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

var dburl = "mongodb://localhost:27017/TodoApp";
mongoose.connect(dburl);
console.log(global.Promise);

var Todo = mongoose.model("Todo", {
    text: {
        type: String,
        required: true,
        minlength: 1,
        trim: true
    },
    isCompleted: {
        type: Boolean,
        default: false
    },
    completedAt: {
        type: Number,
        default: null
    }
});

var User =   mongoose.model("User", {
    email: {
        type: String,
        required: true,
        minlength: 1,
        trim: true
    }
})

var newTodo = new Todo({text: "    hello "});
newTodo.save().then((res) => {console.log("success", res)}, 
                    (reason) => {console.log("error", reason)});

var newUser = new User({email: "stew123@hotmamil.com"});
newUser.save().then((result) => console.log("success", result),
                    (reason) => console.log("Error", reason));