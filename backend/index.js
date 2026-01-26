require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectToMongo = require('./db');

const app = express();
const port = process.env.PORT;

connectToMongo();

app.use(express.json({ limit: '50mb' })); // increase json limit
app.use(express.urlencoded({ limit: '50mb', extended: true })); // increase form limit

app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', '_id', 'user_id', 'authtoken']
}));

// Routes:
app.use('/api/admin', require('./routes/admin'));
app.use('/api/user', require('./routes/user'));
app.use('/api/colorpalette', require('./routes/colorpalette')); 
app.use('/api/drawing', require('./routes/drawing'));
app.use('/api/template', require('./routes/template'));

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});