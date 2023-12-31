const connectToMongo = require('./db');
var cors = require('cors')
const http = require('http')
connectToMongo();





const express = require('express')
const app = express();
const port = process.env.PORT || 5000;

//need to use a middleware if i want to receive a request on endpoin
app.use(cors())
app.use(express.json());


//defining an api request and where its endpoint is defined
app.use('/api/auth', require('./routes/auth'));
app.use('/api/note', require('./routes/note'));



http.createServer(app).listen(port, () => {
  console.log(`NoteBook listening at  http://localhost:${port}`)
})


app.get('*',(req,res,next)=>{
  res.status(200).json({
    message:'bad request'
  })
})
