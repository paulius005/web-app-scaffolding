module.exports = {
  define: function (sequelize, Columns) {
    return sequelize.define('token', {
      token: Columns.STRING()
    });
  },
  associate: function (db) {
    db.Token.belongsTo(db.User);
  }
};
