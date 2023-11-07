const connectToMongo = require('./db');
var cors = require('cors')
connectToMongo();





const express = require('express')
const app = express();
const port = 5000;

//need to use a middleware if i want to receive a request on endpoin
app.use(cors())
app.use(express.json());


//defining an api request and where its endpoint is defined
app.use('/api/auth', require('./routes/auth'));
app.use('/api/note', require('./routes/note'));

app.listen(port, () => {
  console.log(`NoteBook listening at  http://localhost:${port}`)
})