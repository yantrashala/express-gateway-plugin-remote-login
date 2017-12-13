'use strict';

module.exports = function adduser(app, cb) {
  app.models.User.create({
    username: 'test',
    email: 'test@test.com',
    password: 'test'
  }, cb);
};

