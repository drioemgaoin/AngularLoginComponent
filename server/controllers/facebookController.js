'use strict';

var config = require('../config');
var request = require('request');

var facebookController = function(userRepository, tokenHelper, errorProvider, app) {

  app.post('/auth/facebook', function(req, res) {
    var fields = ['id', 'email', 'first_name', 'last_name', 'link', 'name'];
    var accessTokenUrl = 'https://graph.facebook.com/v2.5/oauth/access_token';
    var graphApiUrl = 'https://graph.facebook.com/v2.5/me?fields=' + fields.join(',');
    var params = {
      code: req.body.code,
      client_id: req.body.clientId,
      client_secret: config.FACEBOOK_SECRET,
      redirect_uri: req.body.redirectUri
    };

    request.get({ url: accessTokenUrl, qs: params, json: true }, function(err, response, accessToken) {
      if (response.statusCode !== 200) {
        return res.status(500).send({ message: accessToken.error.message });
      }

      request.get({ url: graphApiUrl, qs: accessToken, json: true }, function(err, response, profile) {
        if (response.statusCode !== 200) {
          return res.status(500).send({ message: profile.error.message });
        }

        if (req.header('Authorization')) {

          userRepository.getByQuery({ facebook: profile.id }, function(result, value) {
            if (!result) {
              var error = value.code ? value : { code: 500, message: value };
              return res.status(error.code).send({ message: error.message });
            }

            if (value) {
              return res.status(errorProvider.existingFacebookAccount.code)
                .send({ message: errorProvider.existingFacebookAccount.message });
            }

            var token = req.header('Authorization').split(' ')[1];
            var payload = tokenHelper.decode(token);

            userRepository.updateFacebookAccount(payload.sub, profile.id, profile.name, function(result, value) {
              if (!result) {
                var error = value.code ? value : { code: 500, message: value };
                return res.status(error.code).send({ message: error.message });
              }

              return res.send({ token: tokenHelper.createJWT(value) });
            });
          });

        } else {

          userRepository.getByQuery({ facebook: profile.id }, function(result, value) {
            if (!result) {
              var error = value.code ? value : { code: 500, message: value };
              return res.status(error.code).send({ message: error.message });
            }

            if (value) {
              return res.send({ token: tokenHelper.createJWT(value) });
            }

            userRepository.addFacebookAccount(profile.id, profile.name, profile.email, function(result, value) {
              if(!result) {
                var error = value.code ? value : { code: 500, message: value };
                return res.status(error.code).send({ message: error.message });
              }

              return res.send({ token: tokenHelper.createJWT(value) });
            });

          });

        }
      });
    });
  });

};

facebookController.$inject = ["userRepository", "tokenHelper", "errorProvider"];

module.exports = facebookController;
