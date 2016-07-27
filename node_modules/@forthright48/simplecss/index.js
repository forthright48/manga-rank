const express = require('express');
const path = require('path');

const app = express();
const server = require('http').createServer(app);

app.set('port', 8001);
app.set('view engine', 'pug');

app.use('/public', express.static(path.join(__dirname, '/public')));
app.use('/public/css', express.static(path.join(__dirname, '/src')));

app.get('/', getHome);
app.get('/navbar', getNavbar);

server.listen(app.get('port'), function() {
  console.log(`SimpleCSS server running at port ${app.get('port')}`);
});


/*******************************************
Implementation
*******************************************/

function getHome(req, res) {
  return res.render('home');
}

function getNavbar(req, res) {
  return res.render('navbar');
}
