const express = require('express');
const ColorPalette = require('../models/ColorPalette');
const router = express.Router();

const { body, validationResult } = require('express-validator');

// Route 1: add color palette using POST method, URL '/api/colorpalette/addcolorpalette'
router.post('/addcolorpalette', [
  body('by_admin').notEmpty().withMessage('by_admin is required.'),

  body('user_id').notEmpty().withMessage('user_id is required.'),

  body('color_palette_name').notEmpty().withMessage('color palette name is required.'),
  
  body('colors').isArray({min:1}).withMessage('Colors is required.')
], async (req, res) => {

  // checking if the request passed all validation rules
  const errors = validationResult(req);

  // if validation failes
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  try {

    await ColorPalette.create({
        by_admin: req.body.by_admin,
        user_id: req.body.user_id,
        color_palette_name: req.body.color_palette_name,
        colors: req.body.colors
    });

    // if color palette is successfully created, respond with success true
    res.json({ success: true });

  } catch (err) {
    // if server-side issues like database connection, undefined variables, etc.
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Route 2: fetch color palette using GET method, URL '/api/colorpalette/userfetchcolorpalette'
router.get('/userfetchcolorpalette', async (req, res) => {
  try {
    const user_id = req.query.user_id;
    
    // fetching user's color palette using user_id excluding
    const colorPaletteDetails = await ColorPalette.find({user_id}).select('-by_admin -user_id -date -__v');
    res.json({ success: true, colorPaletteDetails });
    
  } catch (err) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;