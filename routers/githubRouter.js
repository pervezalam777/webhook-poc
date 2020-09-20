//@ts-nocheck
const path = require('path');

const express = require('express');
const runCommandLine = require('../shell/gitcmd')

const githubRouter = express.Router();

function validate(req, res, next) {
  //TODO: place proper validation here..
  res.locals.validated = true;
  console.log("VALIDATED")
  if(!res.locals.validated){
    res.status(403).send('You are not authorized')
  }
  next()
}

githubRouter.use(validate);

githubRouter.post('/', (req, res) => {
  console.log("is validated ",res.locals.validated)
  const {id, message, added, removed, modified, committer} = req.body.head_commit;
  res.send('success')
  console.log('id: ', id, 'message', message);
  runCommandLine({id, message, added, removed, modified, committer})
})

module.exports = githubRouter;
