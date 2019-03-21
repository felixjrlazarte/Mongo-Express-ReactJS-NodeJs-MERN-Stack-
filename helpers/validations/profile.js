const validator = require('validator');
const common = require('./common');

const createProfileValidators = data => {
  let errors = {};

  data.handle = !common.isEmpty(data.handle) ? data.handle : '';
  data.status = !common.isEmpty(data.status) ? data.status : '';
  data.skills = !common.isEmpty(data.skills) ? data.skills : '';

  if (!validator.isLength(data.handle, { min: 2, max: 40 })) {
    errors.handle = 'Handle needs to between 2 and 4 characters';
  }

  if (validator.isEmpty(data.handle)) {
    errors.handle = 'Handle field is required';
  }

  if (validator.isEmpty(data.status)) {
    errors.status = 'Status field is required';
  }

  if (validator.isEmpty(data.skills)) {
    errors.skills = 'Skills field is required';
  }

  if(!common.isEmpty(data.website) && !validator.isURL(data.website)) {
    errors.website = 'Not a valid URL';
  }

  if(!common.isEmpty(data.youtube) && !validator.isURL(data.youtube)) {
    errors.youtube = 'Not a valid URL';
  }

  if(!common.isEmpty(data.facebook) && !validator.isURL(data.facebook)) {
    errors.facebook = 'Not a valid URL';
  }

  if(!common.isEmpty(data.linkedin) && !validator.isURL(data.linkedin)) {
    errors.linkedin = 'Not a valid URL';
  }

  return {
    errors,
    isValid: common.isEmpty(errors)
  }
};

const addExperienceValidators = data => {
  let errors = {};

  data.title = !common.isEmpty(data.title) ? data.title : '';
  data.company = !common.isEmpty(data.company) ? data.company : '';
  data.from = !common.isEmpty(data.from) ? data.from : '';

  if(validator.isEmpty(data.title)) {
    errors.title = 'Title field is required';
  }

  if(validator.isEmpty(data.company)) {
    errors.company = 'Company field is required';
  }

  if(validator.isEmpty(data.from)) {
    errors.from = 'Date from field is required';
  }

  return {
    errors,
    isValid: common.isEmpty(errors)
  };

};

const addEducationValidators = data => {
  let errors = {};

  data.school = !common.isEmpty(data.school) ? data.school : '';
  data.degree = !common.isEmpty(data.degree) ? data.degree : '';
  data.from = !common.isEmpty(data.from) ? data.from : '';

  if(validator.isEmpty(data.school)) {
    errors.title = 'School field is required';
  }

  if(validator.isEmpty(data.degree)) {
    errors.company = 'Degree field is required';
  }

  if(validator.isEmpty(data.from)) {
    errors.from = 'Date from field is required';
  }

  return {
    errors,
    isValid: common.isEmpty(errors)
  };

};

module.exports = {
  createProfileValidators,
  addExperienceValidators,
  addEducationValidators
}