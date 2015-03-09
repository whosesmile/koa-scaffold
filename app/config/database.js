var database = 'test_db';

var Sequelize = require('sequelize');

var sequelize = new Sequelize(database, 'root', '', {
  dialect: "mysql", // or 'sqlite', 'postgres', 'mariadb'
  port: 3306, // or 5432 (for postgres)
});

sequelize.authenticate().complete(function (err) {
  if (!!err) {
    console.log('Unable to connect to the database:', database, err);
  }
  else {
    console.log('Connection has been established successfully.');
  }
});

var User = sequelize.define('User', {
  username: Sequelize.STRING,
  password: Sequelize.STRING
});

sequelize.sync({
  force: false
}).complete(function (err) {
  if (!!err) {
    console.log('An error occurred while creating the table:', err);
  }
  else {
    console.log('It worked!');
  }
});

var user = User.build({
  username: 'john-doe',
  password: 'i-am-so-great'
});

user.save().complete(function (err) {
  if (!!err) {
    console.log('The instance has not been saved:', err);
  }
  else {
    console.log('We have a persisted instance now');
  }
});

User.find({
  where: {
    username: 'john-doe'
  }
}).complete(function (err, johnDoe) {
  if (!!err) {
    console.log('An error occurred while searching for John:', err);
  }
  else if (!johnDoe) {
    console.log('No user with the username "john-doe" has been found.');
  }
  else {
    console.log('Hello ' + johnDoe.username + '!');
    console.log('All attributes of john:', johnDoe.values);
  }
});