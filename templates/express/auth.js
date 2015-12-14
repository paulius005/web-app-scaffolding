module.exports = function (config, app, db, passport) {
  var LocalStrategy = require('passport-local').Strategy;
  var RememberMeStrategy = require('passport-remember-me').Strategy;
  var uuid = require('node-uuid');
  var bcrypt = require('bcrypt');

  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
    db.User.findOne({where: { id: id }}).then(function (user) {
      done(null, user);
    }).catch(function (err) {
      done(err)
    });
  });

  passport.use(new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password'
    },
    function(username, password, done) {
      db.User.findOne({where: { username: username }}).then(function(user) {
        if (!user) {
          return done(null, false);
        }
        if (!bcrypt.compareSync(password, user.password)) { 
          return done(null, false);
        }
        return done(null, user);
      }).catch(function (err) {
        return done(err);
      });
    })
  );

  passport.use(new RememberMeStrategy(
    function(token, done) {
      db.Token.findOne({where: {token: token.token}}).then(function (token) {
        token.getUser().then(function(user) {
          return done(null, user);
        }).catch(function (err) {
          return done(err);
        });
      }).catch(function (err) {
        return done(err);
      });
    },
    function(user, done) {
      var token = uuid.v4();
      db.Token.create({token: token, userId: user.id}).then(function (token) {
        return done(null, token);
      }).catch(function(err) {
        return done(err);
      });
    }
  ));
  /** Facebook Auth
  var session = require('express-session');
  var passport = require('passport');
  var FacebookStrategy = require('passport-facebook').Strategy;

  passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: config.uri + '/oauth/facebook'
  }, function (accessToken, refreshToken, profile, done) {
    var data = profile._json;
    db.User.findOrCreate({
        where: {
          email: data.email
        },
        defaults: {
          name: data.name,
          email: data.email,
          access: 'user'
        }
      }).spread(function (user, created) {
        done(null, user);
      });
  }));

  passport.serializeUser(function (user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function (user, done) {
    db.User.findById(user.id).then(function (fullUser) {
      done(null, fullUser);
    });
  });

  app.use(session({ secret: config.secret}));
  app.use(passport.initialize());
  app.use(passport.session());

  app.get('/login', passport.authenticate('facebook'));

  app.get('/oauth/facebook', passport.authenticate('facebook', {
    successRedirect: '/',
    failureRedirect: '/failure'
  }));
  */

  /** Stormpath Auth - Assumes STORMPATH API KEY and ID are in env.
  var stormpath = require('express-stormpath');
  app.use(stormpath.init(app, {
    application: process.env.STORMPATH_AUTH_APP_HREF,
    secretKey: config.secret,
    enableFacebook: true,
    social: {
      facebook: {
        appId: process.env.FACEBOOK_APP_ID,
        appSecret: process.env.FACEBOOK_APP_SECRET
      }
    }
  }));
  */
  return {
    ensureAuthenticated: function (req, res, next) {
      if (req.isAuthenticated()) { return next(); }
      res.status(401).json({status: 'unauthorized'});
    },

  }
};
