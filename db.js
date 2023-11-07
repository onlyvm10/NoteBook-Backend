const mongoose = require('mongoose');
const mongoUri = "mongodb+srv://2ce2zw0ab5:2ce2zw0ab5@cluster0.sesmq5x.mongodb.net/";

const connectToMongo = () => {
    mongoose.connect(mongoUri, () => {
        console.log("Connected to MongoDB");
    }).catch((e)=>{
        console.log("Not Connected");
    })

}
 

module.exports = connectToMongo;