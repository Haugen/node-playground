var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/test', { useNewUrlParser: true });

var taskDataSchema = new mongoose.Schema({
  task: {type: String, required: true},
  prio: String,
  completed: Boolean
}, {
  collection: 'tasks'
});

var taskData = mongoose.model('taskData', taskDataSchema);

// Date stuff. Move elsewhere? Yeah, it can't be here, obviously. Slowing down
// everything and creating several new Date objects on every request...
// No bueno! (Now in an if statement, but not sure if that does the trick.)
var days = ['Sundat', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
if (!dateDay && !dateDate && !dateMonth && !dayMonth) {
  var dateDay = new Date().getDay();
  var dateDate = new Date().getDate();
  var dateMonth = new Date().getMonth();
  var dayMonth = `${dateDate} ${months[dateMonth]}`;
}

/**
 * GET the home page where we list all the tasks.
 */
router.get('/', function(req, res, next) {
  Promise.all([
    taskData.find({ completed: false }),
    taskData.find({ completed: true })
  ]).then(function([ uncompleted, completed ]) {
    res.render('index', {
      titleDay: days[dateDay],
      titleDate: dayMonth,
      completed: completed,
      uncompleted: uncompleted,
      errors: req.session.error,
      success: req.session.success
    });
    req.session.error = req.session.success = null;
  });
});

/**
 * POST page for inserting a new task.
 */
router.post('/insert', function(req, res, next) {
  let item = {
    task: req.body.task,
    prio: req.body.prio,
    completed: false
  };

  let data = new taskData(item);
  data.save(function(err) {
    // TODO Figure out how to handle session errors more dynamically.
    if (err) req.session.error = { error: {msg: err.errors.task.message} };
    if (!err) req.session.success = { success: {msg: "Task added."} };
    res.redirect('/');
  });
});

/**
 * GET page for updating a task. Render a form prefilled with the task.
 */
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

/**
 * POST page for updating a task. Set a message and return to front pge.
 */
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
    } else {
      doc.task = req.body.task;
      doc.prio = req.body.prio;
      doc.save();
      req.session.success = { success: {msg: 'Task updated.'} };
    }
    res.redirect('/');
  })
});

/**
 * POST page for deleting a task.
 */
router.post('/delete/:id', function(req, res, next) {
  let id = req.params.id;

  taskData.findByIdAndRemove(id, function(err) {
    if (err) req.session.error = { error: {msg: err.message} };
    req.session.success = { success: {msg: 'Task removed.'} };
    res.redirect('/');
  })
});

/**
 * POST page for completing/uncompleting a task.
 */
router.post('/complete/:id', function(req, res, next) {
  let id = req.params.id;

  taskData.findById(id, function(err, doc) {
    if (err) {
      // TODO Figure out how to handle session errors more dynamically.
      req.session.error = { error: {msg: err.message} };
    } else {
      doc.completed = doc.completed ? false : true;
      let comp = doc.completed ? 'done' : 'undone';
      doc.save();
      req.session.success = { success: {msg: `Task ${comp}.`} };
    }
    res.redirect('/');
  })
});

module.exports = router;
