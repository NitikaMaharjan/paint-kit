const express = require('express');
const User = require('../../models/User');
const router = express.Router();

const { body, validationResult } = require('express-validator');

const bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
const jwt_secret = process.env.JWT_SECRET;

// Route 1: sign up using POST method, URL "/api/auth/user/usersignup"
router.post('/usersignup', [
  body('email').notEmpty().withMessage('Email is required.'),

  body('username').notEmpty().withMessage('Username is required.'),
  
  body('password').notEmpty().withMessage('Password is required.')
], async (req, res) => {

  // checking if the request passed all validation rules
  const errors = validationResult(req);

  // if validation failes
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  try {

    // checking if user with same email already exists
    const user_exists = await User.findOne({email: req.body.email});

    if (user_exists){
      // if user already exists
      return res.status(400).json({ success: false, error: "An account with this email already exists!" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    // if validation passes and user does not exists already then create a new user with the request data
    await User.create({
        email: req.body.email,
        username: req.body.username,
        password: hashedPassword
    });

    // if user is successfully created, respond with success true
    res.json({ success: true });

  } catch (err) {
    // if server-side issues like database connection, undefined variables, etc.
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Route 2: sign in using POST method, URL "/api/auth/user/usersignin"
router.post('/usersignin', [
  body('email').notEmpty().withMessage('Email is required.'),
  
  body('password').notEmpty().withMessage('Password is required.')
], async (req, res) => {

  // checking if the request passed all validation rules
  const errors = validationResult(req);

  // if validation failes
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  const {email, password} = req.body;

  try {

    // checking if user exists
    const user_exists = await User.findOne({email});

    if (!user_exists){
      // if user doesn't exists
      return res.status(400).json({ success: false, error: "An account with this email does not exists!" });
    }

    // checking if the password is correct
    const password_matched = await bcrypt.compare(password, user_exists.password);

    if (!password_matched){
      return res.status(400).json({ success: false, error: "Incorrect password. Please enter password again!" });
    }

    const data = {
      user:{
        id: user_exists.id
      }
    }
    
    const authtoken = jwt.sign(data, jwt_secret);

    // if sign in is successfull, respond with success true and authentication token
    res.json({ success: true, authtoken });

  } catch (err) {
    // if server-side issues like database connection, undefined variables, etc.
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;