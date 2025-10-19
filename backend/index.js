require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectToMongo = require('./db');

const app = express();
const port = process.env.PORT || 5000;

connectToMongo();

app.use(express.json({ limit: "50mb" })); // increase json limit
app.use(express.urlencoded({ limit: "50mb", extended: true })); // increase form limit
app.use(cors());

// Routes:

// For admin and user authentication
app.use('/api/auth/admin', require('./routes/auth/admin')); 
app.use('/api/auth/user', require('./routes/auth/user')); 

// For color palette
app.use('/api/colorpalette/colorpalette', require('./routes/colorpalette/colorpalette')); 

// For drawing
app.use('/api/drawing/drawing', require('./routes/drawing/drawing'));

// For template
app.use('/api/template/template', require('./routes/template/template'));

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});