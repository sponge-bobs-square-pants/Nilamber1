const express = require('express');
const app = express();
//DB
const connectDB = require('./DB/ConnectDB');
const Token = require('./Models/UserSchema');
//CORS
const cors = require('cors');
//.ENV
require('dotenv').config();
//PORT
const port = process.env.PORT || 5000;
//SECURITY
const helmet = require('helmet');
const xss = require('xss-clean');
const rateLimit = require('express-rate-limit');
const EventEmitter = require('events');

app.use(helmet());
app.use(cors());
app.use(xss());
app.use(express.json());

// app.use('/api/v1/Login', login);
app.get('/api/auth/Token', async (req, res) => {
  try {
    const token = await Token.findOne();
    console.log(token);
    if (!token) {
      return res.status(404).json({ error: 'Token not found' });
    }
    const FullToken = 'Zoho-oauthtoken ' + token.BearerToken;
    return res.json({ token: FullToken });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
app.post('/api/auth/Token', async (req, res) => {
  try {
    // Create a new Token document based on the request body
    const newToken = new Token({
      BearerToken: req.body.BearerToken, // Assuming the BearerToken is sent in the request body
    });

    // Save the new token to the database
    await newToken.save();

    // Respond with a success message
    return res.json({ message: 'Token saved successfully', token: newToken });
  } catch (error) {
    // If an error occurs, respond with an error message
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

//START APP
const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, console.log(`Server is listening on port ${port}...`));
  } catch (error) {
    console.log(error);
  }
};
start();
