const express = require('express');
const app = express();
require('dotenv').config();
const bodyParser = require("body-parser")
const cors = require("cors")


app.use(express.json());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors())

const dbConnect = require("./config/connection");
dbConnect();

const uploadRoutes = require('./routes/uploadRoutes');
app.use('/api', uploadRoutes);

// Start the server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
