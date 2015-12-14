module.exports = function (auth, db, passport) {
  var express = require('express');
  var router = express.Router();
  var uuid = require('node-uuid');
  var bcrypt = require('bcrypt');

  router.post('/register', function(req, res) {
    db.User.create({
      username: req.body.username,
      password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(8))
    },{
      fields: ['username', 'password']
    }).then(function(user) {
      passport.authenticate('local')(req, res, function () {
        return res.status(200).json({status: 'Registration successful!'});
      });
    }).catch(function (err) {
      res.status(500).json({err: err});
    });
  });

  router.post('/login',
    passport.authenticate('local'),
    function(req, res, next) {
      if (!req.body.remember_me) { return next(); }

      var token = uuid.v4();
      db.Token.create({token: token, userId: req.user.id}).then(function (token) {
        res.cookie('remember_me', token, { path: '/', httpOnly: false, maxAge: 604800000 }); // 7 days
        return next();
      }).catch(function(err) {
        res.status(500).json({err: err});
      });
    },
    function(req, res) {
      res.status(200).json({status: 'Login successful!'});
    }
  );

  router.get('/logout', function(req, res) {
    res.clearCookie('remember_me');
    req.logout();
    res.status(200).json({status: 'Bye!'});
  });

  router.get('/loggedin', auth.ensureAuthenticated, function(req, res) {
    res.status(200).json({ 
      user: req.user.username,
      user_id: req.user.id
    });
  });

  router.get('/user', auth.ensureAuthenticated, function(req, res){
    res.status(200).json({ 
      username: req.user.username,
      user_id: req.user.id
    });
  });

  return router;
};
