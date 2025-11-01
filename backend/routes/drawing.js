const express = require('express');
const Drawing = require('../models/Drawing');
const router = express.Router();

const { body, validationResult } = require('express-validator');

// Route 1: save drawing using POST method, URL '/api/drawing/savedrawing'
router.post('/savedrawing', [
  body('user_id').notEmpty().withMessage('user id is required.'),

  body('drawing_title').notEmpty().withMessage('drawing title is required.'),
  
  body('drawing_tag').notEmpty().withMessage('drawing tag is required.'),
  
  body('drawing_url').notEmpty().withMessage('drawing url is required.')
], async(req, res) => {

  // check if the request passed all validation rules
  const errors = validationResult(req);

  // if validation failes
  if(!errors.isEmpty()){
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  try{
    await Drawing.create({
      user_id: req.body.user_id,
      drawing_title: req.body.drawing_title,
      drawing_tag: req.body.drawing_tag,
      drawing_url: req.body.drawing_url
    });

    // if drawing is successfully saved, respond with success true
    res.json({ success: true });
  }catch(err){
    // if server-side issues like database connection, undefined variables, etc
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Route 2: fetch drawings using GET method, URL '/api/drawing/fetchdrawing'
router.get('/fetchdrawing', async(req, res) => {
  try{
    // fetch user drawings using user id excluding user_id and __v
    const fetchedDrawings = await Drawing.find({ user_id: req.header('user_id') }).select('-user_id -__v');
    res.json({ success: true, fetchedDrawings });
  }catch(err){
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Route 3: delete drawing using DELETE method, URL '/api/drawing/deletedrawing'
router.delete('/deletedrawing', async(req, res) => {
  try{
    await Drawing.findByIdAndDelete(req.header('_id'));
    res.json({ success: true });
  }catch(err){
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Route 4: fetch drawing to edit info using GET method, URL '/api/drawing/fetchdrawingtoedit'
router.get('/fetchdrawingtoedit', async(req, res) => {
  try{
    const fetchedDrawingInfo = await Drawing.findById({ _id: req.header('_id') }).select('-user_id -__v');
    if(fetchedDrawingInfo){
      res.json({ success: true, fetchedDrawingInfo });
    }else{
      res.json({ success: false, error: 'Drawing not found!' });
    }
  }catch(err){
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;