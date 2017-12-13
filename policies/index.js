'use strict';
const passport = require('passport');
const ActionParams = require('../services/actionParams');


// passport.serializeUser((user, done) => done(null, user.id));

// passport.deserializeUser((id, done) => {
//   return authService.validateConsumer(id)
//     .then(consumer => {
//       if (!consumer) return done(null, false);
//       return done(null, consumer);
//     })
//     .catch(err => done(err));
// });


module.exports = {
  name: 'remote-login',
  policy: (_actionParams) => {
    return (req, res, next) => {
      let actionParamsNew = new ActionParams();
      copyProperties(_actionParams,actionParamsNew)
      actionParamsNew.session = false;
      passport.authenticate('bearer', actionParamsNew, actionParamsNew.getCommonAuthCallback(req, res, next))(req, res, next);
    };
  }
};

function copyProperties(actionParamsOrg, actionParamsNew) {
  Object.getOwnPropertyNames(actionParamsOrg).forEach(elem => {
    if(elem !== 'getCommonAuthCallback')
      actionParamsNew[elem] = actionParamsOrg[elem];
  });
};
