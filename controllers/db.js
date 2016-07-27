const models = require('express-cassandra');
const session = require('express-session');
const CassandraStore = require('cassandra-store');
const secret = require('forthright48/world').secret;


/*model configuration*/
models.setDirectory(`${__dirname}/../models`).bind({
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

///Session Store
function addSession(app) {
  const options = {
    table: 'sessions',
    client: null,
    clientOptions: {
      contactPoints: ['localhost'],
      keyspace: 'manga',
      queryOptions: {
        prepare: true
      }
    }
  };

  app.use(session({
    secret,
    resave: false,
    saveUninitialized: false,
    store: new CassandraStore(options)
  }));
}

module.exports = {
  addSession
};
