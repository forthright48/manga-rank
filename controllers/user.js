'use strict';
const express = require('express');
const models = require('express-cassandra');

const router = express.Router();

router.get('/', getLogin);

module.exports = {
  addRouter(app) {
    app.use('/', router);
  }
}

/*******************************************************************************
Implementation
*******************************************************************************/
function getLogin(req, res, next) {
  res.redner('login');
}
