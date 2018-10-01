var express = require('express');
var router = express.Router();
var mongo = require('mongodb').MongoClient;
var objectId = require('mongodb').ObjectID;
var assert = require('assert');

var dbUrl = 'mongodb://localhost:27017/test';

// GET home page.
router.get('/', function(req, res, next) {
  let results = [];
  // Connect to the mongo db with the dbUrl.
  mongo.connect(dbUrl, function(err, client) {
    // In the first callback we get all the items from the 'tasks' collection.
    assert.equal(null, err);
    let db = client.db('test');
    let cursor = db.collection('tasks').find();
    // Then iterate over the db items and push each one into an array.
    cursor.forEach(function(doc, err) {
      assert.equal(null, err);
      results.push(doc);
    }, function() {
      // The second callback will be called once the first one finishes. Here we
      // close the connection and then render the front page with the results.
      client.close();
      res.render('index', {
        title: 'Simple TODO!',
        success: req.session.success,
        errors: req.session.errors,
        items: results
      });
      req.session.errors = req.session.success = null;
    });
  })
});

// Inserting data.
router.post('/insert', function(req, res, next) {
  // If the task textfield is empty, redirect to front page with an error.
  if (!req.body.task) {
    req.session.errors = {error: { msg: "You need to enter a task." }};
    res.redirect('/');
  } else {
    // create an item object from the input fields.
    let item = {
      task: req.body.task,
      prio: req.body.prio
    };

    // Connect to the database and inser the new item.
    mongo.connect(dbUrl, function(err, client) {
      assert.equal(null, err);
      let db = client.db('test');
      db.collection('tasks').insertOne(item, function(err, result) {
        assert.equal(null, err);
        client.close();
        req.session.success = {success: { msg: "Task successfully added." } };
        res.redirect('/');
      });
    });
  }
});

// GET page for Updating data.
router.get('/update/:id', function(req, res, next) {
  let id = req.params.id;
  let result = {};

  mongo.connect(dbUrl, function(err, client) {
    assert.equal(null, err);
    let db = client.db('test');
    let item = db.collection('tasks').find(objectId(id));
    // TODO Don't use forEach here, it will always be only one object. Figure
    // out how to get the data from item properly.
    item.forEach(function(doc, err) {
      assert.equal(null, err);
      result = doc;
    }, function() {
      res.render('update', {
        item: result,
      });
    })
  });
});

// POST page for updating the item in the db.
router.post('/update/:id', function(req, res, next) {
  let id = req.params.id;
  let item = {
    task: req.body.task,
    prio: req.body.prio
  }

  mongo.connect(dbUrl, function(err, client) {
    assert.equal(null, err);
    let db = client.db('test');
    db.collection('tasks').updateOne({"_id": objectId(id)}, {$set: item}, function(err, result) {
      assert.equal(null, err);
      client.close();
      req.session.success = {success: { msg: "Task successfully updated." } };
      res.redirect('/');
    });
  });
});

// Deleting data.
router.post('/delete/:id', function(req, res, next) {
  let id = req.params.id;
  mongo.connect(dbUrl, function(err, client) {
    assert.equal(null, err);
    let db = client.db('test');
    db.collection('tasks').deleteOne({"_id": objectId(id)}, function(err, result) {
      assert.equal(null, err);
      client.close();
      req.session.success = {success: { msg: "Task successfully deleted." } };
      res.redirect('/');
    });
  });
});

module.exports = router;
