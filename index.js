'use strict';

const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const models = require('express-cassandra');

const app = express();
const server = require('http').createServer(app);

const rootPath = __dirname;

/*app configuration*/
app.set('port', process.env.PORT || 8002);
app.use('/public', express.static(path.join(rootPath, '/public')));
app.use('/public/css', express.static(path.join(rootPath, '/node_modules/@forthright48/simplecss/src')));

app.use(bodyParser.json()); // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({ // to support URL-encoded bodies
  extended: true
}));

/*model configuration*/
models.setDirectory(`${__dirname}/models`).bind({
    clientOptions: {
      contactPoints: ['127.0.0.1'],
      protocolOptions: {
        port: 9042
      },
      keyspace: 'manga',
      queryOptions: {
        consistency: models.consistencies.one
      }
    },
    ormOptions: {
      defaultReplicationStrategy: {
        class: 'SimpleStrategy',
        replication_factor: 1
      },
      dropTableOnSchemaChange: true, //recommended to keep it false in production, use true for development convenience.
      createKeyspace: true
    }
  },
  function(err) {
    if (err) console.log(err.message);
    else console.log(models.timeuuid());
  }
);

/*Pug*/
app.set('view engine', 'pug'); ///Support for handlebars rendering
app.set('views', `${__dirname}/views`);

app.get('/', home);
app.get('/insert', getInsert);
app.post('/insert', postInsert);
app.get('/delete/:id', getDelete);
app.get('/edit/:id', getEdit);
app.post('/edit/:id', postUpdate);


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
function home(req, res, next) {
  models.instance.Manga.find({}, function(err, all) {
    if (err) next(err);
    res.render('home', {
      data: all
    });
  });
}

function getInsert(req, res) {
  res.render('insert');
}

function parseBodyToModel(obj, body) {
  obj.name = body.name;
  obj.author = body.author;
  obj.tags = body.tags.split(',');
  obj.photoURL = body.photoURL;
  obj.startingDate = models.datatypes.LocalDate.fromString(body.startingDate);
  obj.completed = body.completed === '1';
  obj.rank = parseFloat(body.rank);
  obj.rating = parseFloat(body.rating);
  obj.description = body.description;
}

function postInsert(req, res, next) {
  let obj = {};
  parseBodyToModel(obj, req.body);
  const newRow = new models.instance.Manga(obj);

  newRow.save(function(err) {
    if (err) return next(err);
    else return res.redirect('/');
  });
}

function getDelete(req, res, next) {
  const id = models.datatypes.Uuid.fromString(req.params.id);

  models.instance.Manga.findOne({
    id
  }, function(err, row) {
    if (err) return next(err);
    row.delete(function(err) {
      if (err) return next(err);
      return res.redirect('/');
    });
  });
}

function getEdit(req, res, next) {
  const id = models.datatypes.Uuid.fromString(req.params.id);

  models.instance.Manga.findOne({
      id
    },
    function(err, row) {
      if (err) return next(err);
      res.render('edit', {
        data: row
      });
    });
}

function postUpdate(req, res, next) {
  const id = models.datatypes.Uuid.fromString(req.params.id);
  models.instance.Manga.findOne({
    id
  }, function(err, row) {
    if (err) return next(err);
    parseBodyToModel(row, req.body);
    row.save(function(err) {
      if (err) return next(err);
      return res.redirect('/');
    });
  });
}
