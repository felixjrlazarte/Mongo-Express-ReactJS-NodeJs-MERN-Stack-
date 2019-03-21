const validator = require('validator');
const common = require('./common');

const loginValidators = data => {
  let errors = {};

  data.email = !common.isEmpty(data.email) ? data.email : '';
  data.password = !common.isEmpty(data.password) ? data.password : '';

  if (!validator.isEmail(data.email)) {
    errors.email = 'Email must be a valid email';
  }

  if(!validator.isLength(data.password, {min: 6, max: 30})) {
    errors.password = 'Password must be between 6 and 30 characters';
  }

  return {
    errors,
    isValid: common.isEmpty(errors)
  };
};

const registerValidators = data => {
  let errors = {};

  data.name = !common.isEmpty(data.name) ? data.name : '';
  data.email = !common.isEmpty(data.email) ? data.email : '';
  data.password = !common.isEmpty(data.password) ? data.password : '';

  if(!validator.isLength(data.name, {min: 2, max: 30})) {
    errors.name = 'Name must be between 2 and 30 characters';
  }

  if (!validator.isEmail(data.email)) {
    errors.email = 'Email must be a valid email';
  }

  if(!validator.isLength(data.password, {min: 6, max: 30})) {
    errors.password = 'Password must be between 6 and 30 characters';
  }

  return {
    errors,
    isValid: common.isEmpty(errors)
  };
}

module.exports = {
  loginValidators,
  registerValidators
};