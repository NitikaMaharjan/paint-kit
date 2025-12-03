const express = require('express');
const User = require('../models/User');
const router = express.Router();

const { body, validationResult } = require('express-validator');

const bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
const jwt_secret = process.env.JWT_SECRET;

var verifyUserToken = require('../middleware/verifyUserToken');

// Route 1: sign up using POST method, URL '/api/user/usersignup'
router.post('/usersignup', [
  body('user_email').notEmpty().withMessage('Email is required.'),

  body('user_username').notEmpty().withMessage('Username is required.'),
  
  body('user_password').notEmpty().withMessage('Password is required.')
], async(req, res) => {

  // check if the request passed all validation rules
  const errors = validationResult(req);

  // if validation failes
  if(!errors.isEmpty()){
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  try{
    // check if user with same email already exists
    const user_exists = await User.findOne({ user_email: req.body.user_email });

    if(user_exists){
      // if user already exists
      return res.status(400).json({ success: false, error: 'An account with this email already exists!' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.user_password, salt);

    // if validation passes and user does not exists already then create a new user with the request data
    await User.create({
      user_email: req.body.user_email,
      user_username: req.body.user_username,
      user_password: hashedPassword
    });

    // if user is successfully created, respond with success true
    res.json({ success: true });
  }catch(err){
    // if server-side issues like database connection, undefined variables, etc
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Route 2: sign in using POST method, URL '/api/user/usersignin'
router.post('/usersignin', [
  body('user_email').notEmpty().withMessage('Email is required.'),
  
  body('user_password').notEmpty().withMessage('Password is required.')
], async(req, res) => {

  // check if the request passed all validation rules
  const errors = validationResult(req);

  // if validation failes
  if(!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  const { user_email, user_password } = req.body;

  try{
    // check if user exists
    const user_exists = await User.findOne({ user_email });

    if(!user_exists){
      // if user doesn't exists
      return res.status(400).json({ success: false, error: 'An account with this email does not exists!' });
    }

    // check if the password is correct
    const password_matched = await bcrypt.compare(user_password, user_exists.user_password);

    if(!password_matched){
      // if password doesn't match
      return res.status(400).json({ success: false, error: 'Incorrect password. Please enter password again!' });
    }

    const data = {
      user:{
        id: user_exists.id
      }
    }
    
    const authtoken = jwt.sign(data, jwt_secret);

    // if sign in is successfull, respond with success true and authentication token
    res.json({ success: true, authtoken });
  }catch(err){
    // if server-side issues like database connection, undefined variables, etc
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Route 3: fetch signed in user details using GET method, URL '/api/user/fetchuserdetails'
// verifyUserToken is a middleware which verifies the authtoken
router.get('/fetchuserdetails', verifyUserToken, async(req, res) => {
  try{
    const user_id = req.user.id;

    // fetch user's email and username using user_id excluding user_password, user_registered_date and __v
    const signedInUserDetails = await User.findById(user_id).select('-user_password -user_registered_date -__v');
    res.json({ success: true, signedInUserDetails });
  }catch(err){
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Route 4: update password using PUT method, URL '/api/user/usereditpassword'
router.put("/usereditpassword", [
  body('user_id').notEmpty().withMessage('User id is required.'),

  body('current_password').notEmpty().withMessage('Current password is required.'),
  
  body('new_password').notEmpty().withMessage('New password is required.')
], async(req, res) => {

  // check if the request passed all validation rules
  const errors = validationResult(req);

  // if validation failes
  if(!errors.isEmpty()){
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  try{
    // check if user exists
    const user_exists = await User.findOne({ _id: req.body.user_id });

    if(user_exists){
      // if user exists, check if the current password matches with saved password
      const password_matched = await bcrypt.compare(req.body.current_password, user_exists.user_password);

      if(!password_matched){
        // if password doesn't match
        return res.status(400).json({ success: false, error: 'Incorrect current password. Please enter your current password again!' });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(req.body.new_password, salt);

      await User.findByIdAndUpdate(user_exists._id, { user_password: hashedPassword }, { new: true });
      res.json({ success: true });
    }else{
      return res.status(400).json({ success: false, error: 'An account with this id does not exists!' });
    }
  }catch(err){
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;