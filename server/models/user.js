const {mongoose} = require('../db/mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrpyt = require('bcryptjs');

const secret = "abc123";

var UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        minlength: 1,
        trim: true,
        unique: true,
        validate: {
            validator: validator.isEmail,
            message: '{VALUE} is not a valid email'
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    tokens: [{
        access: {
            type: String,
            required: true
        },
        token: {
            type: String,
            required: true
        }
    }]
});

UserSchema.pre('save', function(next) {

    var user = this;
    if (user.isModified('password')) {
        bcrpyt.genSalt(10, (error, salt) => {
            bcrpyt.hash(user.password, salt, (e2, hashedPassword) => {
                user.password = hashedPassword;
                next();
            });
        });
    } else {
        next();
    }
});

UserSchema.methods.toJSON = function() {
    var user = this;
    var userObject = user.toObject();
    return _.pick(userObject, ["_id", "email"]);
};

UserSchema.methods.generateAuthToken = function() {
    var user = this;
    var access = "auth";
    var token = jwt.sign({_id: user._id.toHexString(), access}, secret).toString();
    user.tokens = user.tokens.concat([{access, token}]);
    return user.save().then(() => {
        return token;
    });
};

UserSchema.statics.findByToken = function(token) {
    var User = this;
    var decoded;
    try {
        decoded = jwt.verify(token, secret)
    } catch (error) {
        return Promise.reject();
    }

    return User.findOne({
        '_id': decoded,
        'tokens.token': token,
        'tokens.access': 'auth'

    });
};

UserSchema.statics.findByCredentials = function(email, password) {
    var User = this;
    return User.findOne({email}).then((user) => {
        return new Promise((resolve, reject) => {
            bcrpyt.compare(password, user.password, (error, doesMatch) => {
                if (error) {
                    return reject();
                }
                if (doesMatch) {
                    user.generateAuthToken().then((token) => {
                        return resolve(user);
                    }).catch((err) => {
                        return reject();
                    });
                } else {
                    return reject();
                }
            });
        });
    });
};

var User =   mongoose.model("User", UserSchema);

module.exports = {User};