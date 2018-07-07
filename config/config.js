const envDevelopment = 'development';
const envTest = 'test';
var env = process.env.NODE_ENV || envDevelopment;
if (env === envDevelopment) {
    process.env.PORT = 3000;
    process.env.MONGODB_URI = "mongodb://localhost:27017/TodoApp";
} else if (env === envTest) {
    process.env.PORT = 3000;
    process.env.MONGODB_URI = "mongodb://localhost:27017/TodoAppTest";
}