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
      dropTableOnSchemaChange: false, //recommended to keep it false in production, use true for development convenience.
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
