const express = require('express');
const Template = require('../models/Template');
const router = express.Router();

const { body, validationResult } = require('express-validator');

// Route 1: save template using POST method, URL '/api/template/savetemplate'
router.post('/savetemplate', [
  body('admin_id').notEmpty().withMessage('User id is required.'),

  body('template_title').notEmpty().withMessage('Template title is required.'),
  
  body('template_tag').notEmpty().withMessage('Template tag is required.'),
  
  body('template_url').notEmpty().withMessage('Image url is required.')
], async(req, res) => {

  // check if the request passed all validation rules
  const errors = validationResult(req);

  // if validation failes
  if(!errors.isEmpty()){
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  try{
    await Template.create({
      admin_id: req.body.admin_id,
      template_title: req.body.template_title,
      template_tag: req.body.template_tag,
      template_url: req.body.template_url
    });

    // if template is successfully saved, respond with success true
    res.json({ success: true });
  }catch(err){
    // if server-side issues like database connection, undefined variables, etc
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Route 2: fetch templates using GET method, URL '/api/template/fetchtemplate'
router.get('/fetchtemplate', async(req, res) => {
  try{
    // fetch template excluding admin_id and __v
    const fetchedTemplates = await Template.find().select('-admin_id -__v');
    res.json({ success: true, fetchedTemplates });
  }catch(err){
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Route 3: delete template using DELETE method, URL '/api/template/deletetemplate'
router.delete('/deletetemplate', async(req, res) => {
  try{
    await Template.findByIdAndDelete(req.header('_id'));
    res.json({ success: true });
  }catch(err){
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Route 4: update template using PUT method, URL '/api/template/edittemplate/:id'
router.put("/edittemplate/:id", async(req, res) => {
  try{
    const edit_date = new Date();
    await Template.findByIdAndUpdate(req.params.id, { admin_id: req.body.admin_id, template_title: req.body.template_title, template_tag: req.body.template_tag, template_url: req.body.template_url, template_updated_date: edit_date.toISOString() }, { new: true });
    res.json({ success: true });
  }catch(err){
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Route 5: fetch template to use info using GET method, URL '/api/template/fetchtemplatetouse'
router.get('/fetchtemplatetouse', async(req, res) => {
  try{
    const fetchedTemplateInfo = await Template.findById({ _id: req.header('_id') }).select('-admin_id -__v');
    if(fetchedTemplateInfo){
      res.json({ success: true, fetchedTemplateInfo });
    }else{
      res.json({ success: false, error: 'Template not found!' });
    }
  }catch(err){
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;