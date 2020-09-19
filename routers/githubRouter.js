//@ts-nocheck
const path = require('path');

const express = require('express');

const githubRouter = express.Router();

function validate(req, res, next) {
  res.locals.validated = true;
  console.log("VALIDATED")
  //TODO: 403 forbidden if user is not authorized.
  next()
}

githubRouter.use(validate);

githubRouter.post('/', (req, res, next) => {
  console.log("is validated ",res.locals.validated)
  console.log('admin route', req.body)
  res.send('success')
})

module.exports = githubRouter;
