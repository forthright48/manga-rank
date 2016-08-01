'use strict';
const express = require('express');
const models = require('express-cassandra');

const myRender = require('forthright48/world').myRender;

const router = express.Router();
const admin = express.Router();

router.get('/login', getLogin);
router.post('/login', postLogin);
router.get('/logout', getLogout);

module.exports = {
  addRouter(app) {
    app.use('/', router);
    app.use('/admin', admin);
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

    if (!user) return myRender(req, res, 'error', {
      msg: 'No such username'
    });

    if (user.password !== password) myRender(req, res, 'error', {
      msg: 'Password Doesn\'t Match'
    });

    req.session.username = username;
    req.session.login = true;

    return res.redirect('/');
  });
}

function getLogout(req, res) {
  req.session.destroy(function(err) {
    if (err) return myRender(req, res, 'error', {
      msg: 'Session destruction failed. Try again.'
    });
    res.redirect('/');
  });
}
