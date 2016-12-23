'use strict';

var errorProvider = function() {
  return {
    userNotFound: { code: 400, message: 'User not found' },
    invalidEmailPassword: { code: 401, message: 'Invalid email and/or password' },
    emailAlreadyTaken: { code: 402, message: 'Email is already taken' },
    existingFacebookAccount: { code: 403, message: 'There is already a Facebook account that belongs to you' },
    existingGoogleAccount: { code: 404, message: 'There is already a Google account that belongs to you' }
  };
};

module.exports = errorProvider;
