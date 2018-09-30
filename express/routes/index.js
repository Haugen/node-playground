var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', {
    title: 'Validation and sessions',
    success: req.session.success,
    errors: req.session.errors,
    success: req.session.success
  });
  req.session.errors = req.session.success = null;
});

router.post('/submit', function(req, res, next) {
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
