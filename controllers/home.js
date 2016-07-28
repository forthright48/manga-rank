'use strict';

const express = require('express');
const models = require('express-cassandra');

const myRender = require('forthright48/world').myRender;

const router = express.Router();

router.get('/', home);
router.get('/insert', getInsert);
router.post('/insert', postInsert);
router.get('/delete/:id', getDelete);
router.get('/edit/:id', getEdit);
router.post('/edit/:id', postUpdate);
router.get('/author/:author', getAuthor);
router.get('/tags/:tag', getTag);

module.exports = {
  addRouter(app) {
    app.use('/', router);
  }
};


/*******************************************************************************
Implementation
*******************************************************************************/
function home(req, res, next) {
  models.instance.Manga.find({}, function(err, all) {
    if (err) next(err);
    return myRender(req, res, 'home', {
      data: all
    });
  });
}

function getInsert(req, res) {
  return myRender(req, res, 'insert');
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
      myRender(req, res, 'edit', {
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

function getAuthor(req, res, next) {
  const author = req.params.author;
  models.instance.Manga.find({
    author
  }, {
    materialized_view: 'author_search'
  }, function(err, all) {
    if (err) return next(err);
    return myRender(req, res, 'home', {
      data: all
    });
  });
}

function getTag(req, res, next) {
  const tag = req.params.tag;

  models.instance.Manga.find({
    tags: {
      $contains: tag
    }
  }, function(err, all) {
    if (err) return next(err);
    return myRender(req, res, 'home', {
      data: all
    });
  });
}
