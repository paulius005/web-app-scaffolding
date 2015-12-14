module.exports = {
  define: function (sequelize, Columns) {
    return sequelize.define('user', {
      id: Columns.ID(),
      username: Columns.USERNAME(),
      access: Columns.STRING(),
      password: Columns.STRING()
    });
  },
  associate: function (db) {
    db.User.hasOne(db.Token);
  }
};
