var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/test', { useNewUrlParser: true });

var taskDataSchema = new mongoose.Schema({
  task: {type: String, required: true},
  prio: String
}, {
  collection: 'tasks'
});

var taskData = mongoose.model('taskData', taskDataSchema);

// GET home page.
router.get('/', function(req, res, next) {
  taskData.find().then(function(doc) {
    res.render('index', {
      title: 'TODOlodelo',
      items: doc,
      errors: req.session.error,
      success: req.session.success
    });
    req.session.error = req.session.success = null;
  });
});

// Inserting data.
router.post('/insert', function(req, res, next) {
  let item = {
    task: req.body.task,
    prio: req.body.prio
  };

  let data = new taskData(item);
  data.save(function(err) {
    // TODO Figure out how to handle session errors more dynamically.
    if (err) req.session.error = { error: {msg: err.errors.task.message} };
    res.redirect('/');
  });
});

// GET page for Updating data.
router.get('/update/:id', function(req, res, next) {
  let id = req.params.id;
  taskData.findById(id, function(err, doc) {
    if (err) {
      // TODO Figure out how to handle session errors more dynamically.
      req.session.error = { error: {msg: err.message} };
      res.redirect('/');
    } else {
      let prio = {[doc.prio.toLowerCase()]: true};
      res.render('update', { item: doc, prio: prio });
    }
  });
});

// POST page for updating the item in the db.
router.post('/update/:id', function(req, res, next) {
  let id = req.params.id;
  let item = {
    task: req.body.task,
    prio: req.body.prio
  }

  taskData.findById(id, function(err, doc) {
    if (err) {
      // TODO Figure out how to handle session errors more dynamically.
      req.session.error = { error: {msg: err.message} };
      res.redirect('/');
    } else {
      doc.task = req.body.task;
      doc.prio = req.body.prio;
      doc.save();
      req.session.success = { success: {msg: `Task with id: ${id} updated.`} };
      res.redirect('/');
    }
  })
});

// Deleting data.
router.post('/delete/:id', function(req, res, next) {
  let id = req.params.id;

  taskData.findByIdAndRemove(id, function(err) {
    if (err) req.session.error = { error: {msg: err.message} };
    res.redirect('/');
  })
});

module.exports = router;
