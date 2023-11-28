const mongoose = require('mongoose')

const mongoURI='mongodb://127.0.0.1/inotebook'

const connectToMongo= async()=>{
    mongoose.connect(mongoURI)
}
module.exports= connectToMongo;