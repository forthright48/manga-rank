'use strict';

const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const logger = require('forthright48/logger');

const app = express();
const server = require('http').createServer(app);
const myRender = require('forthright48/world').myRender;

const rootPath = __dirname;

/*app configuration*/
app.set('port', process.env.PORT || 8002);
app.use('/public', express.static(path.join(rootPath, '/public')));
app.use('/public/css', express.static(path.join(rootPath, '/node_modules/@forthright48/simplecss/src')));

logger.debug('Overriding \'Express\' logger');
app.use(morgan('dev', {
  stream: logger.stream
}));


app.use(bodyParser.json()); // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({ // to support URL-encoded bodies
  extended: true
}));

require('./controllers/db.js').addSession(app); ///Add session and models

/*Pug*/
app.set('view engine', 'pug'); ///Support for handlebars rendering
app.set('views', `${__dirname}/views`);

/*Custom Middleware*/
app.use('/admin', function(req, res, next) {
  if (req.session.login) return next();
  res.redirect('/login');
});

/*Router*/
require('./controllers/home.js').addRouter(app); ///Add routes related to homepage
require('./controllers/user.js').addRouter(app); ///Add routes related to login

/*404 and 500*/
app.get('/*', function(req, res) {
  res.status(400);
  myRender(req, res, 'error', {
    msg: 'No such path'
  });
});

app.use(function(err, req, res) {
  res.status(500);
  myRender(req, res, 'error', {
    msg: err
  });
});

if (require.main === module) {
  server.listen(app.get('port'), function() {
    console.log(`Server running at port ${ app.get('port') }`);
  });
} else {
  module.exports = {
    server,
    app
  };
}
