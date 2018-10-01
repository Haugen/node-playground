var express = require('express');
var router = express.Router();

// GET home page.
router.get('/', function(req, res, next) {

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
  }
});

// GET page for Updating data.
router.get('/update/:id', function(req, res, next) {
  let id = req.params.id;
  let result = {};
});

// POST page for updating the item in the db.
router.post('/update/:id', function(req, res, next) {
  let id = req.params.id;
  let item = {
    task: req.body.task,
    prio: req.body.prio
  }
});

// Deleting data.
router.post('/delete/:id', function(req, res, next) {
  let id = req.params.id;
});

module.exports = router;
