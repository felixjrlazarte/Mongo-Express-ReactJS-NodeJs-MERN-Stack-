const express = require('express');
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = express.Router();

const User = require('../../models/User');
const secretKey = require('../../config/keys').secretKey;
const usersValidators = require('../../helpers/validations/users');

router.post('/register', async (req, res) => {

  const data = req.body;
  const { errors, isValid } = usersValidators.registerValidators(data);
  
  if (isValid) {
    try {
      const user = await User.findOne({ email: data.email })
      if (!user) {
        // Create default avatar
        const avatar = gravatar.url(data.email, {
          s: '200', // Size
          r: 'pg', // Rating
          d: 'mm' // Default
        });
    
        const newUser = new User({
          name: data.name,
          email: data.email,
          avatar,
          password: data.password
        });
    
        // Encrypt password 
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if(err) throw err;
            newUser.password = hash;
            newUser.save()
              .then(user => res.json(user))
              .catch(err => console.log(err));
          })
        });
      } else {
        errors.email = 'Email already exists';
        return res.status(400).json({errorMessage: errors});
      }
    } catch (error) {
      res.status(400).json({ errorMessage: error });
    }
  } else {
    return res.status(400).json({errorMessage: errors});
  }
});

router.post('/login', async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const { errors, isValid } = usersValidators.loginValidators(req.body);
  if (isValid) {
    try {
      // Find user by email
      const user = await User.findOne({email});
      if (user) {
        // Check password if match
        const isMatch = await bcrypt.compare(password, user.password)
        if (isMatch) {
          // Create JWT payload
          const payload = { 
            id: user.id,
            name: user.name,
            email: user.email,
            avatar: user.avatar
          };
          // Sign token
          jwt.sign(payload, secretKey, { expiresIn: 3600 }, (err, token) => {
            res.json({success: true, token: 'Bearer ' + token})
          });
  
        } else {
          return res.status(404).json({errorMessage: 'Password incorrect!'});
        }
      } else {
        res.status(400).json({errorMessage: 'User not found!!'});
      }
    } catch (error) {
      res.status(400).json({errorMessage: error});
    }
  } else {
    return res.status(400).json({errorMessage: errors});
  }
});

module.exports = router;