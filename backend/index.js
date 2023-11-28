const connectToMongo= require('./db')
const express= require('express')
const mongoose = require('mongoose')

connectToMongo();
const app= express();

app.use(express.json())

//Available Routes
app.use('/api/auth',require('./routes/auth'))
app.use('/api/note',require('./routes/haveNotes'))

app.listen(5000)

