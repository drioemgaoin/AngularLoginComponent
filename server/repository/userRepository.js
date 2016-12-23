'use strict';

var User = require('../models/user');

var userRepository = function(tokenHelper, errorProvider) {

  function updateAccount(sub, id, name, setAccount, cb) {
    User.findById(sub, function(err, user) {
      if (err) {
        return cb(false, err.message);
      }

      if (!user) {
        return cb(false, errorProvider.userNotFound);
      }

      setAccount(user, id);
      user.displayName = user.displayName || name;

      user.save(function(err) {
        if (err) {
          return cb(false, err.message);
        }

        cb(true, user);
      });
    });
  }

  function addAccount(id, name, email, setAccount, cb) {
    var user = new User({
      displayName: name,
      email: email
    });

    setAccount(user, id);

    user.save(function(err) {
      if (err) {
        return cb(false, err.message);
      }

      cb(true, user);
    });
  }

  return {
    getByQuery: function(query, cb, select) {
      User.findOne(query, select, function(err, user) {
        if (err) {
          return cb(false, err.message);
        }

        cb(true, user);
      });
    },

    getById: function(id, cb) {
      User.findById(id, function(err, user) {
        if (err) {
          return cb(false, err.message);
        }

        cb(true, user);
      });
    },

    addFacebookAccount: function(id, name, email, cb) {
      var setAccount = function(user, id) {
        user.facebook = id;
      };

      addAccount(id, name, email, setAccount, cb);
    },

    addGoogleAccount: function(id, name, email, cb) {
      var setAccount = function(user, id) {
        user.google = id;
      };

      addAccount(id, name, email, setAccount, cb);
    },

    updateFacebookAccount: function(sub, id, name, cb) {
      var setAccount = function(user, id) {
        user.facebook = id;
      };

      updateAccount(sub, id, name, setAccount, cb);
    },

    updateGoogleAccount: function(sub, id, name, cb) {
      var setAccount = function(user, id) {
        user.google = id;
      };

      updateAccount(sub, id, name, setAccount, cb);
    },

    add: function(displayName, email, password, cb) {
      var user = new User({
        displayName: displayName,
        email: email,
        password: password
      });

      user.save(function(err) {
        if (err) {
          return cb(false, err.message);
        }

        cb(true);
      });
    }
  };
};

userRepository.$inject = ["tokenHelper", "errorProvider"];

module.exports = userRepository;
