module.exports = function (config, auth, db, passport) {
  var express = require('express');
  var router = express.Router();

  var users = require('./controllers/users_controller.js')(auth, db, passport);
  router.use('/users', users);

  return router;
};
