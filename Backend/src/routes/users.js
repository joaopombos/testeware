var express = require('express');
var router = express.Router();

/* GET users lsting. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

module.exports = router;
