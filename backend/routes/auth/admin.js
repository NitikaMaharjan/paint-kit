const express = require('express');
const Admin = require('../../models/Admin');
const router = express.Router();

const { body, validationResult } = require('express-validator');

const bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
const jwt_secret = process.env.JWT_SECRET;

var verifyAdminToken = require('../../middleware/verifyAdminToken');

// Route 1: sign up using POST method, URL '/api/auth/admin/adminsignup'
router.post('/adminsignup', [
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

    // checking if admin with same email already exists
    const admin_exists = await Admin.findOne({email: req.body.email});

    if (admin_exists){
      // if admin already exists
      return res.status(400).json({ success: false, error: 'An account with this email already exists!' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    // if validation passes and admin does not exists already then create a new admin with the request data
    await Admin.create({
        email: req.body.email,
        username: req.body.username,
        password: hashedPassword
    });

    // if admin is successfully created, respond with success true
    res.json({ success: true });

  } catch (err) {
    // if server-side issues like database connection, undefined variables, etc.
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Route 2: sign in using POST method, URL '/api/auth/admin/adminsignin'
router.post('/adminsignin', [
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

    // checking if admin exists
    const admin_exists = await Admin.findOne({email});

    if (!admin_exists){
      // if admin doesn't exists
      return res.status(400).json({ success: false, error: 'An account with this email does not exists!' });
    }

    // checking if the password is correct
    const password_matched = await bcrypt.compare(password, admin_exists.password);

    if (!password_matched){
      return res.status(400).json({ success: false, error: 'Incorrect password. Please enter password again!' });
    }

    const data = {
      admin:{
        id: admin_exists.id
      }
    }
    
    const authtoken = jwt.sign(data, jwt_secret);

    // if sign in is successfull, respond with success true and authentication token
    res.json({ success: true, authtoken });

  } catch (err) {
    // if server-side issues like database connection, undefined variables, etc.
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Route 3: fetching signed in admin details using GET method, URL '/api/auth/admin/fetchadmindetails'
// verifyAdminToken is a middleware which verifies the authtoken
router.get('/fetchadmindetails', verifyAdminToken, async (req, res) => {
  try {
    const admin_id = req.admin.id;
    
    // fetching admin's email and username using user_id excluding _id, password, date and __v
    const signedInAdminDetails = await Admin.findById(admin_id).select('-_id -password -date -__v');
    res.json({ success: true, signedInAdminDetails });
    
  } catch (err) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;