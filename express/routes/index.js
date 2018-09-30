var express = require('express');
var router = express.Router();
var mongo = require('mongodb');
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
      });
    });

    res.redirect('/');
  }
});

// Updating data.
router.post('/update', function(req, res, next) {

});

// Deleting data.
router.post('/delete', function(req, res, next) {

});

/* Old POST for the homepage. Practice with a submitted form. */
router.post('/old-submit', function(req, res, next) {
  req.check('email', 'Incorrect e-mail address.').isEmail();
  req.check('password', 'Try again with password, caballero!')
    .isLength({min: 4})
    .equals(req.body.confirmPassword);

  let errors = req.validationErrors();
  console.log(errors);
  if (errors) {
    req.session.errors = errors;
    req.session.success = false;
  } else {
    req.session.success = true;
  }
  res.redirect('/')
});

module.exports = router;
