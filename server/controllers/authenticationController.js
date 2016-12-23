'use strict';

var authenticationController = function(userRepository, tokenHelper, errorProvider, app) {

  app.post('/auth/login', function(req, res) {
    userRepository.getByQuery({ email: req.body.email }, function(result, value) {
      if (!result) {
        var error = value.code ? value : { code: 500, message: value };
        return res.status(error.code).send({ message: error.message });
      }

      if (!value) {
        return res.status(errorProvider.userNotFound.code)
          .send({ message: errorProvider.userNotFound.message });
      }

      value.comparePassword(req.body.password, function(err, isMatch) {
        if (!isMatch) {
          return res.status(errorProvider.invalidEmailPassword.code)
            .send({ message: errorProvider.invalidEmailPassword.message });
        }

        res.send({ token: tokenHelper.createJWT(value) });
      });
    }, '+password');
  });

  app.post('/auth/signup', function(req, res) {
    userRepository.getByQuery({ email: req.body.email }, function(result, value) {
      if (!result) {
        var error = value.code ? value : { code: 500, message: value };
        return res.status(error.code).send({ message: error.message });
      }

      if (value) {
        return res.status(errorProvider.emailAlreadyTaken.code)
          .send({ message: errorProvider.emailAlreadyTaken.message });
      }

      userRepository.add(req.body.displayName, req.body.email, req.body.password, function(result, value) {
        if (!result) {
          var error = value.code ? value : { code: 500, message: value };
          return res.status(error.code).send({ message: error.message });
        }

        return res.send({ token: tokenHelper.createJWT(value) });
      });
    });
  });

};

authenticationController.$inject = ["userRepository", "tokenHelper", "errorProvider"];

module.exports = authenticationController;
