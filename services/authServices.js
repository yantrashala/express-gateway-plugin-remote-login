'use strict';
const request = require('request-promise-native');



var _pluginContext;
var loginURL;

module.exports.init = function (pluginContext) {
  _pluginContext = pluginContext;
  loginURL = pluginContext.settings.url;
  if (!loginURL) {
    _pluginContext.logger.plugins.error('url property for the plugin is mandatory');
  }

}


module.exports.authenticateLocal = function (req, clientId, clientSecret, done) {
  //const credentialType = 'basic-auth';

  const options = {
    method: 'POST',
    json: true,
    uri: loginURL,
    body: {
      "username": clientId,
      "password": clientSecret
    }
  };

  request(options)
    .then(function (tokenObj) {

      
      tokenObj.consumerId =
        tokenObj.userId || tokenObj.consumerId;

      let tokenOption = {
        refreshTokenOnly: false,
        includeRefreshToken: false
      }
      let userObj = tokenObj.user;
      tokenObj.user = JSON.stringify(tokenObj.user);

      return _pluginContext.services.token.save(tokenObj, tokenOption)
        .then(function (tokens) {
          let responseObj = userObj;
          responseObj.access_token = tokens.access_token;
          return responseObj;
        })
    })
    .then(function (result) {
      return done(null, result);
    })
    .catch(function (err) {
      return done(err);
    });
};


module.exports.authenticateToken = function (req, accessToken, done) {
  // let endpointScopes;
  // if (req.egContext.apiEndpoint && req.egContext.apiEndpoint.scopes) {
  //   endpointScopes = req.egContext.apiEndpoint.scopes;
  // }

  let tokenObj;
  const tokenPassword = accessToken.split('|')[1];
  delete req.headers.authorization;


  _pluginContext.services.token.get(accessToken)
    .then(_tokenObj => {
      tokenObj = _tokenObj;

      if (!tokenObj) {
        return null;
      }

      req.headers.authorization = new Buffer('user:'+tokenObj.user).toString('base64');

      tokenObj.user = JSON.parse(tokenObj.user);
      delete tokenObj.tokenDecrypted;

      console.log(tokenObj);

      return tokenObj;
    })
    .then(tokenObj => {
      if(!tokenObj)
        return done(null, false);
      return done(null, tokenObj);
    });
    // .then(consumer => {
    //   if (!consumer || !consumer.isActive) {
    //     return false;
    //   } else return tokenObj.tokenDecrypted === tokenPassword ? { token: tokenObj, consumer } : false;
    // });



  
  /*

  return authService.authenticateToken(accessToken)
    .then(res => {
      if (!res) {
        return done(null, false);
      }

      token = res.token;
      consumer = res.consumer;

      return authService.authorizeToken(accessToken, 'oauth2', endpointScopes)
        .then(authorized => {
          if (!authorized) {
            return done(null, false);
          }
          delete req.headers.authorization;
          delete token.tokenDecrypted;
          consumer.token = token;

          if (!token.authenticatedUserId) {
            return done(null, consumer);
          }

          return authService.validateConsumer(token.authenticatedUserId)
            .then(user => {
              if (!user) {
                return done(null, false);
              }
              consumer.token = token;
              return done(null, consumer);
            });
        });
    });*/
}