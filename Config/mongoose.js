const mongoose=require('mongoose');

mongoose.connect(process.env.MONGODB_URL || `mongodb://localhost:27017/onlinequiz`);

const db=mongoose.connection

db.on('error',console.error.bind(console,'error in database connection'));

db.once('open',function(){
    console.log("Successful Connected to datbase");
});