require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectToMongo = require("./db");

const app = express();
const port = process.env.PORT || 5000;

connectToMongo();

app.use(express.json());
app.use(cors());

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});