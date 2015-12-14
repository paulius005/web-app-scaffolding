module.exports = function(appConfig) {
  var fs = require('fs');
  var path = require('path');
  var Sequelize = require('sequelize');
  var Columns = require('./columns.js');

  var config = appConfig;
  var sequelize = new Sequelize(config.database, config.username, config.password, config);

  var db = {};
  var models = ['user', 'token'];
  var modelDefs = [];

  models.forEach(function (modelName) {
    var modelDef = require('./models/' + modelName + '.js');
    modelDefs.push(modelDef);
    var modelFriendly = modelName.replace(/_([a-z])/g, function (x) {
      return x.toUpperCase();
    }).replace(/^([a-z])/, function (x) { return x.toUpperCase(); });

    var model = modelDef.define(sequelize, Columns);
    db[modelFriendly] = model;
  });

  modelDefs.forEach(function (modelDef) {
    modelDef.associate(db);
  });

  db.sequelize = sequelize;
  db.Sequelize = Sequelize;

  return db;
};
