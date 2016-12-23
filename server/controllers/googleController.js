'use strict';

var config = require('../config');
var request = require('request');

var googleController = function(userRepository, tokenHelper, errorProvider, app) {

  app.post('/auth/google', function(req, res) {
    var accessTokenUrl = 'https://accounts.google.com/o/oauth2/token';
    var peopleApiUrl = 'https://www.googleapis.com/plus/v1/people/me/openIdConnect';
    var params = {
      code: req.body.code,
      client_id: req.body.clientId,
      client_secret: config.GOOGLE_SECRET,
      redirect_uri: req.body.redirectUri,
      grant_type: 'authorization_code'
    };

    request.post(accessTokenUrl, { json: true, form: params }, function(err, response, token) {
      var accessToken = token.access_token;
      var headers = { Authorization: 'Bearer ' + accessToken };

      request.get({ url: peopleApiUrl, headers: headers, json: true }, function(err, response, profile) {
        if (profile.error) {
          return res.status(500).send({message: profile.error.message});
        }

        if (req.header('Authorization')) {

          userRepository.getByQuery({ google: profile.sub }, function(result, value) {
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

            userRepository.updateGoogleAccount(payload.sub, profile.sub, profile.name, function(result, value) {
              if (!result) {
                var error = value.code ? value : { code: 500, message: value };
                return res.status(error.code).send({ message: error.message });
              }

              return res.send({ token: tokenHelper.createJWT(value) });
            });
          });

        } else {

          userRepository.getByQuery({ google: profile.sub }, function(result, value) {
            if (!result) {
              var error = value.code ? value : { code: 500, message: value };
              return res.status(error.code).send({ message: error.message });
            }

            if (value) {
              return res.send({ token: tokenHelper.createJWT(value) });
            }

            userRepository.addGoogleAccount(profile.sub, profile.name, profile.email, function(result, value) {
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

googleController.$inject = ["userRepository", "tokenHelper", "errorProvider"];

module.exports = googleController;
