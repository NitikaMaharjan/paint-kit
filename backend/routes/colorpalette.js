const express = require('express');
const ColorPalette = require('../models/ColorPalette');
const router = express.Router();

const { body, validationResult } = require('express-validator');

// Route 1: save color palette using POST method, URL '/api/colorpalette/savecolorpalette'
router.post('/savecolorpalette', [
  body('by_admin').notEmpty().withMessage('by_admin is required.'),

  body('user_id').notEmpty().withMessage('User id is required.'),

  body('color_palette_name').notEmpty().withMessage('Color palette name is required.'),
  
  body('colors').isArray({ min:1 }).withMessage('Colors is required.')
], async(req, res) => {

  // check if the request passed all validation rules
  const errors = validationResult(req);

  // if validation failes
  if(!errors.isEmpty()){
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  try{
    await ColorPalette.create({
      by_admin: req.body.by_admin,
      user_id: req.body.user_id,
      color_palette_name: req.body.color_palette_name,
      colors: req.body.colors
    });

    // if color palette is successfully saved, respond with success true
    res.json({ success: true });
  }catch(err){
    // if server-side issues like database connection, undefined variables, etc
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Route 2: fetch user's color palettes using GET method, URL '/api/colorpalette/fetchusercolorpalette'
router.get('/fetchusercolorpalette', async(req, res) => {
  try{
    const user_id = req.query.user_id;
    
    // fetch user's color palette using user_id excluding -by_admin, -user_id, -__v
    const fetchedUserColorPalette = await ColorPalette.find({ user_id }).select('-by_admin -user_id -__v');
    res.json({ success: true, fetchedUserColorPalette });
  }catch(err){
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Route 3: fetch admin's color palettes using GET method, URL '/api/colorpalette/fetchadmincolorpalette'
router.get('/fetchadmincolorpalette', async(req, res) => {
  try{
    // fetch admin's color palette using by_admin excluding -by_admin, -user_id, -__v
    const fetchedAdminColorPalette = await ColorPalette.find({ by_admin: true }).select('-by_admin -user_id -__v');
    res.json({ success: true, fetchedAdminColorPalette });
  }catch(err){
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Route 4: delete color palette using DELETE method, URL '/api/colorpalette/deletecolorpalette'
router.delete('/deletecolorpalette', async(req, res) => {
  try{
    await ColorPalette.findByIdAndDelete(req.header('_id'));
    res.json({ success: true });
  }catch(err){
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Route 5: update color palette using PUT method, URL '/api/colorpalette/editcolorpalette/:id'
router.put("/editcolorpalette/:id", async(req, res) => {
  try{
    const edit_date = new Date();
    await ColorPalette.findByIdAndUpdate(req.params.id, { color_palette_name: req.body.color_palette_name, colors: req.body.colors, palette_updated_date: edit_date.toISOString() }, { new: true });
    res.json({ success: true });
  }catch(err){
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;