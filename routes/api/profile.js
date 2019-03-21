const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const router = express.Router();

const Profile = require('../../models/Profile');
const profileValidators = require('../../helpers/validations/profile')

// @route  GET api/profile
// @desc   Get current users profile
// @access Private
router.get('/', passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      const foundProfile = await Profile.findOne({ user: req.user.id })
        .populate('user', ['name', 'avatar']);
      if (foundProfile) {
        res.json(foundProfile);
      } else {
        res.status(404).json({ errorMessage: 'This is no profile for this user'});
      }
    } catch (error) {
      res.status(404).json(error);
    }
});

router.get('/list', async (req, res) => {
  try {
    const userProfile = await Profile.find()
      .populate('user', ['name', 'avatar']);
    res.json(userProfile);
  } catch (error) {
    res.status(404).json({ errorMessage: error });
  }
});

router.get('/handle/:handle', async (req, res) => {
  try {
    const userProfile = await Profile.findOne({ handle: req.params.handle })
      .populate('user', ['name', 'avatar']);
    res.json(userProfile);
  } catch (error) {
    res.status(404).json({ errorMessage: error });
  }
});

router.get('/user/:user_id', async (req, res) => {
  try {
    const userProfile = await Profile.findOne({ user: req.params.user_id })
      .populate('user', ['name', 'avatar']);
    res.json(userProfile);
  } catch (error) {
    res.status(404).json({ errorMessage: error });
  }
});

router.post('/create-profile', passport.authenticate('jwt', { session: false }),
  async (req, res) => {

    const { errors, isValid } = profileValidators.createProfileValidators(req.body);
    if (isValid) {
      try {
        const data = req.body;
        const profileFields = {};
        profileFields.user = req.user.id;
        if (data.handle) profileFields.handle = data.handle;
        if (data.company) profileFields.company = data.company;
        if (data.website) profileFields.website = data.website;
        if (data.location) profileFields.location = data.location;
        if (data.bio) profileFields.bio = data.bio;
        if (data.status) profileFields.status = data.status;
        if (data.githubusername) profileFields.githubusername = data.githubusername;
        // Skills
        if (typeof data.skills !== 'undefined') profileFields.skills = data.skills.split(',');
        // Social
        profileFields.social = {};
        if (data.youtube) profileFields.social.youtube = data.youtube;
        if (data.facebook) profileFields.social.facebook = data.facebook;
        if (data.linkedin) profileFields.social.linkedin = data.linkedin;
  
        const hasProfile = await Profile.findOne({user: req.user.id});
        if (!hasProfile) {
          // Create new profile
          
          // Check if handle exists
          const hashandle = await Profile.findOne({ handle: profileFields.handle });
          if (hashandle) {
            res.status(404).json({ errorMessage: 'That handle already exists'});
          }
  
          // Save Profile
          const saveProfile = await new Profile(profileFields).save();
          if (saveProfile) {
            res.json({message: 'Successfully save', profile: saveProfile});
          }
  
        } else {
          // Update profile
          const updateProfile = await Profile.findOneAndUpdate(
            { user: req.user.id }, // user to be update
            { $set: profileFields },
            { new: true }
          );
          res.json({message: 'Successfully updated', profile: updateProfile});
        }
  
      } catch (error) {
        res.status(400).json({errorMessage: error});
      }
    } else {
      res.status(400).json({ errorMessage: errors });
    }
});

router.post('/add-experience', passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    const { errors, isValid } = profileValidators.addExperienceValidators(req.body);
    if (isValid) {
      try {
        const data = req.body;
        const foundProfile = await Profile.findOne({ user: req.user.id });
        if (foundProfile) {
          const newExperience = {
            title: data.title,
            company: data.company,
            location: data.location,
            from: data.from,
            to: data.to,
            current: data.current,
            description: data.description
          }
          foundProfile.experience.unshift(newExperience);
          const saveExperience = await foundProfile.save();
          if (saveExperience) {
            res.json(saveExperience);
          }
        }
      } catch (error) {
        res.status(400).json({errorMessage: error});
      }
    } else {
      res.status(400).json({errorMessage: errors});
    }
});

router.post('/add-education', passport.authenticate('jwt', { session: false}),
  async (req, res) => {
    const { errors, isValid } = profileValidators.addEducationValidators(req.body);
    if (isValid) {
      try {
        const data = req.body;
        const foundProfile = await Profile.findOne({ user: req.user.id });
        if (foundProfile) {
          const newEducation = {
            school: data.school,
            degree: data.degree,
            fieldofstudy: data.fieldofstudy,
            from: data.from,
            to: data.to,
            current: data.current,
            description: data.description
          }
          foundProfile.education.unshift(newEducation);
          const saveEducation = await foundProfile.save();
          if (saveEducation) {
            res.json(saveEducation);
          } 
        }
      } catch (error) {
        res.status(404).json({ errorMessage: error });
      }
    } else {
      res.status(404).json({ errorMessage: errors });
    }
});

module.exports = router;