const express = require('express');
const Admin = require('../models/Admin');
const router = express.Router();

const { body, validationResult } = require('express-validator');

const bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
const jwt_secret = process.env.JWT_SECRET;

var verifyAdminToken = require('../middleware/verifyAdminToken');

// Route 1: sign up using POST method, URL '/api/admin/adminsignup'
router.post('/adminsignup', [
  body('admin_email').notEmpty().withMessage('email is required.'),

  body('admin_username').notEmpty().withMessage('username is required.'),
  
  body('admin_password').notEmpty().withMessage('password is required.')
], async(req, res) => {

  // check if the request passed all validation rules
  const errors = validationResult(req);

  // if validation failes
  if(!errors.isEmpty()){
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  try{
    // check if admin with same email already exists
    const admin_exists = await Admin.findOne({ admin_email: req.body.admin_email });

    if(admin_exists){
      // if admin already exists
      return res.status(400).json({ success: false, error: 'An account with this email already exists!' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.admin_password, salt);

    // if validation passes and admin does not exists already then create a new admin with the request data
    await Admin.create({
      admin_email: req.body.admin_email,
      admin_username: req.body.admin_username,
      admin_password: hashedPassword
    });

    // if admin is successfully created, respond with success true
    res.json({ success: true });
  }catch(err){
    // if server-side issues like database connection, undefined variables, etc
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Route 2: sign in using POST method, URL '/api/admin/adminsignin'
router.post('/adminsignin', [
  body('admin_email').notEmpty().withMessage('email is required.'),
  
  body('admin_password').notEmpty().withMessage('password is required.')
], async(req, res) => {

  // check if the request passed all validation rules
  const errors = validationResult(req);

  // if validation failes
  if(!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  const { admin_email, admin_password } = req.body;

  try{
    // check if admin exists
    const admin_exists = await Admin.findOne({ admin_email });

    if(!admin_exists){
      // if admin doesn't exists
      return res.status(400).json({ success: false, error: 'An account with this email does not exists!' });
    }

    // check if the password is correct
    const password_matched = await bcrypt.compare(admin_password, admin_exists.admin_password);

    if(!password_matched){
      // if password doesn't match
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
  }catch(err){
    // if server-side issues like database connection, undefined variables, etc
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Route 3: fetch signed in admin details using GET method, URL '/api/admin/fetchadmindetails'
// verifyAdminToken is a middleware which verifies the authtoken
router.get('/fetchadmindetails', verifyAdminToken, async(req, res) => {
  try{
    const admin_id = req.admin.id;
    
    // fetch admin's email and username using user_id excluding admin_password, admin_registered_date and __v
    const signedInAdminDetails = await Admin.findById(admin_id).select('-admin_password -admin_registered_date -__v');
    res.json({ success: true, signedInAdminDetails });
  }catch(err){
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Route 4: update password using PUT method, URL '/api/admin/admineditpassword'
router.put("/admineditpassword", [
  body('user_id').notEmpty().withMessage('admin id is required.'),

  body('current_password').notEmpty().withMessage('current password is required.'),
  
  body('new_password').notEmpty().withMessage('new password is required.')
], async(req, res) => {

  // check if the request passed all validation rules
  const errors = validationResult(req);

  // if validation failes
  if(!errors.isEmpty()){
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  try{
    // check if admin exists
    const admin_exists = await Admin.findOne({ _id: req.body.user_id });

    if(admin_exists){
      // if admin exists, check if the current password matches with saved password
      const password_matched = await bcrypt.compare(req.body.current_password, admin_exists.admin_password);

      if(!password_matched){
        // if password doesn't match
        return res.status(400).json({ success: false, error: 'Incorrect current password. Please enter your current password again!' });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(req.body.new_password, salt);

      await Admin.findByIdAndUpdate(admin_exists._id, { admin_password: hashedPassword }, { new: true });
      res.json({ success: true });
    }else{
      return res.status(400).json({ success: false, error: 'An account with this id does not exists!' });
    }
  }catch(err){
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;