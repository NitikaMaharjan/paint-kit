const express = require('express');
const Template = require('../../models/Template');
const router = express.Router();

const { body, validationResult } = require('express-validator');

// Route 1: save template using POST method, URL '/api/template/template/savetemplate'
router.post('/savetemplate', [
  body('user_id').notEmpty().withMessage('user id is required.'),

  body('template_title').notEmpty().withMessage('template title is required.'),
  
  body('template_tag').notEmpty().withMessage('template tag is required.'),
  
  body('image_url').notEmpty().withMessage('image url is required.')
], async (req, res) => {

  // checking if the request passed all validation rules
  const errors = validationResult(req);

  // if validation failes
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  try {

    await Template.create({
        user_id: req.body.user_id,
        template_title: req.body.template_title,
        template_tag: req.body.template_tag,
        image_url: req.body.image_url
    });

    // if template is successfully saved, respond with success true
    res.json({ success: true });

  } catch (err) {
    // if server-side issues like database connection, undefined variables, etc.
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Route 2: fetch templates using GET method, URL '/api/template/template/fetchtemplate'
router.get('/fetchtemplate', async (req, res) => {
  try {
    
    // fetching template using excluding user_id and __v
    const templates = await Template.find().select('-user_id -__v');
    res.json({ success: true, templates });
    
  } catch (err) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Route 3: delete template using DELETE method, URL '/api/template/template/deletetemplate'
router.delete('/deletetemplate', async (req, res) => {
  try {

    await Template.findByIdAndDelete(req.header('_id'));
    res.json({ success: true });

  } catch (err) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Route 4: update template using PUT method, URL '/api/template/template/edittemplate/:id'
router.put("/edittemplate/:id", async (req, res) => {
  try {
    const edit_date = new Date();
    await Template.findByIdAndUpdate(req.params.id, { user_id: req.body.user_id, template_title: req.body.template_title, template_tag: req.body.template_tag, image_url: req.body.image_url, date: edit_date.toISOString() }, { new: true });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;