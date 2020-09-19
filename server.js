//@ts-nocheck
const path = require('path');

const express = require('express');
const helmet = require('helmet');

const githubRouter = require('./routers/githubRouter');
const runCommandLine = require('./shell/gitcmd')

const app = express();
app.use(helmet());
app.use(express.urlencoded({extended: true}));
app.use(express.json());

app.use('/github', githubRouter);
app.get('/', (req, res) => {
  res.send('Server for Webhook');
  runCommandLine();
})

const port = process.env.PORT || 5052;
app.listen(port, err => {
  if(err){
    console.error(`Server failed to start ${err.message}`);
    return;
  }
  console.log(`server started at port ${port}`);
});

