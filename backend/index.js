require('dotenv').config();
const express = require('express');
const connectToMongo = require('./db');
// const cors = require('cors');

const app = express();
const frontend_url = process.env.FRONTEND_URL;

// use of cors library
// app.use(cors({
//   origin: frontend_url,
//   methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
//   allowedHeaders: ['Content-Type', '_id', 'user_id', 'authtoken'],
//   optionsSuccessStatus: 200
// }));

// manual cors setup
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', frontend_url);
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,_id,user_id,authtoken');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  next();
});

connectToMongo();

app.use(express.json({ limit: '50mb' })); // increase json limit
app.use(express.urlencoded({ limit: '50mb', extended: true })); // increase form limit

// Routes:
app.use('/api/admin', require('./routes/admin'));
app.use('/api/user', require('./routes/user'));
app.use('/api/colorpalette', require('./routes/colorpalette')); 
app.use('/api/drawing', require('./routes/drawing'));
app.use('/api/template', require('./routes/template'));

if (process.env.NODE_ENV !== 'production') {
  const port = process.env.PORT;
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}

module.exports = app;