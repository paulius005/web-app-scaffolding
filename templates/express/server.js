var express = require('express');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var passport = require('passport');
var path = require('path');

var app = express();
app.use(bodyParser.json());
app.use(cookieParser('keyboard cat'));

app.set('view engine', 'jade');
app.set('views', __dirname + '/views');
app.use(express.static('www-root'));
app.use(session({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(passport.authenticate('remember-me'));

var config = require('./db/config/config.json')[process.env.NODE_ENV || 'development'];
var db = require('./db/index.js')(config);
var auth = require('./auth.js')(config, app, db, passport);
var router = require('./routes.js')(config, auth, db, passport);

db.sequelize.sync();

app.use('/', router);

app.listen(process.env.PORT || 3000);
