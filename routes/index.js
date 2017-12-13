'use strict';
const passport = require('passport');
const bodyParser = require('body-parser');



module.exports = function (gatewayExpressApp) {

  const middlewares = [
    bodyParser.urlencoded({ extended: true }),
    bodyParser.json(),
    passport.initialize(),
    passport.authenticate('local', { session: false })
  ];

  gatewayExpressApp.post('/oauth2/token', middlewares, function (req, res) {
    res.send(req.user);
  });

  gatewayExpressApp.get('/logout', function (req, res) {
    req.logout();
    res.send({msg:"USR_LOGGED_OUT"});
  });

};
