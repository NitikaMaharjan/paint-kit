const express = require('express');
const Admin = require('../../models/Admin');
const router = express.Router();

const { body, validationResult } = require('express-validator');

const bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
const jwt_secret = process.env.JWT_SECRET;

// Route 1: sign up using POST method, URL "/api/auth/admin/signup"
router.post('/signup', [
  body('email').notEmpty().withMessage('Email must not be empty'),

  body('username').notEmpty().withMessage('Username must not be empty'),
  
  body('password').notEmpty().withMessage('Password must not be empty')
], async (req, res) => {

  // checking if the request passed all validation rules
  const errors = validationResult(req);

   // if validation failes
  if (!errors.isEmpty()) {
    return res.json({ success: false, error: "Input fields must not be empty" });
  }

  try {

    // checking if admin with same email already exists
    const admin_exists = await Admin.findOne({email: req.body.email});

    if (admin_exists){
      // if admin already exists
      return res.json({ success: false, error: "Email already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    // if validation passes and admin does not exists already then create a new admin with the request data
    const admin = await Admin.create({
        email: req.body.email,
        username: req.body.username,
        password: hashedPassword
    }); 

    const data = {
      admin:{
        id: admin.id
      }
    }
    
    const authtoken = jwt.sign(data, jwt_secret);

    // if admin is successfully created, respond with success true and authentication token
    res.json({ success: true, authtoken });

  } catch (err) {
    // if server-side issues like database connection, undefined variables, etc.
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;