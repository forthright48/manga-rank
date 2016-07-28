'use strict';
const express = require('express');
const models = require('express-cassandra');

const router = express.Router();

router.get('/login', getLogin);
router.post('/login', postLogin);

module.exports = {
  addRouter(app) {
    app.use('/', router);
  }
};

/*******************************************************************************
Implementation
*******************************************************************************/
function getLogin(req, res) {
  res.render('login');
}

function postLogin(req, res, next) {
  const username = req.body.username;
  const password = req.body.password;

  models.instance.User.findOne({
    username
  }, function(err, user) {
    if (err) return next(err);

    if (!user) return res.render('error', {
      msg: 'No such username'
    });

    if (user.password !== password) return res.render('error', {
      msg: 'Password Doesn\'t Match'
    });

    req.session.username = username;
    req.session.login = true;

    return res.redirect('/');
  })
}
