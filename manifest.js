'use strict';
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const BearerStrategy = require('passport-http-bearer').Strategy;
const authService = require('./services/authServices');

passport.use(new LocalStrategy({ passReqToCallback: true }, authService.authenticateLocal));
passport.use(new BearerStrategy({ passReqToCallback: true }, authService.authenticateToken));

module.exports = {
  version: '1.2.0',
  init: function (pluginContext) {
    authService.init(pluginContext);
    pluginContext.registerPolicy(require('./policies/'));
    pluginContext.registerCondition(require('./conditions/url-match'));
    pluginContext.registerGatewayRoute(require('./routes/'));
  },
  policies:['remote-login']
};

