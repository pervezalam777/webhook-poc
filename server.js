//@ts-nocheck
const path = require('path');

const express = require('express');
const helmet = require('helmet');

const githubRouter = require('./routes/githubRouter');

const app = express();
app.use(helmet());
app.use(express.urlencoded());
app.use(express.json());

app.use('/github', githubRouter);
app.get('/', (req, res) => {
  res.send('Server for Webhook')
})

const port = process.env.PORT || 5052;
app.listen(port, err => {
  if(err){
    console.error(`Server failed to start ${err.message}`);
    return;
  }
  console.log(`server started at port ${port}`);
});

