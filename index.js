'use strict';

const express = require('express');
const path = require('path');

const app = express();
const server = require('http').createServer(app);

const port = 8002;
const rootPath = __dirname;

/*app configuration*/
app.set('port', process.env.PORT || 8002);
app.use('/public', express.static(path.join(rootPath, '/public')));
app.use('/public/css', express.static(path.join(rootPath, '/node_modules/@forthright48/simplecss/src')));

/*Pug*/
app.set('view engine', 'pug'); ///Support for handlebars rendering
app.set('views', `${__dirname}/views`);

app.get('/', home);
app.get('/insert', getInsert);


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

/*******************************************************************************
Implementation
*******************************************************************************/
function home(req, res) {
  res.render('home');
}

function getInsert(req, res) {
  res.render('insert');
}
