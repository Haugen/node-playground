var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', {
    title: 'Validation and sessions',
    success: false,
    errors: req.session.errors
  });
  //req.sessions.errors = null;
});

router.post('/submit', function(req, res, next) {

});

/* GET users listing. */
router.get('/users', function(req, res, next) {
  res.send('respond with a resource');
});

/* GET a test page. */
router.get('/test/:id/:name', function(req, res, next) {
  res.render('test', { id: req.params.id, name: req.params.name });
});

/* POST to a test page. */
router.post('/test/submit', function(req, res, next) {
  let id = req.body.id;
  let name = req.body.name;
  res.redirect(`/test/${id}/${name}`);
});

module.exports = router;
