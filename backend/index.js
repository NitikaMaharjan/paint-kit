require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectToMongo = require('./db');

const app = express();
const port = process.env.PORT;

connectToMongo();

app.use(express.json({ limit: "50mb" })); // increase json limit
app.use(express.urlencoded({ limit: "50mb", extended: true })); // increase form limit
app.use(cors());

// Routes:

// For admin
app.use('/api/admin', require('./routes/admin'));

// For user
app.use('/api/user', require('./routes/user'));

// For color palette
app.use('/api/colorpalette', require('./routes/colorpalette')); 

// For drawing
app.use('/api/drawing', require('./routes/drawing'));

// For template
app.use('/api/template', require('./routes/template'));

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});