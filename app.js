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
    const token = Token.findOne();
    if (!token) {
      return res.status(404).json({ error: 'Token not found' });
    }
    return res.json({ token: token.BearerToken });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
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
