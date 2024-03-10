const express = require('express');
const app = express();
const axios = require('axios');
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

app.post('/api/auth/newToken', async (req, res) => {
  const name = req.body;
  if (!name) {
    return res.status(404).json({ error: 'Name not found' });
  }
  console.log('I m getting called');
  try {
    // const zohoData = {
    //   refresh_token:
    //     '1000.e571752c5d9e9b94044542621327ae38.2fc29af8ab61fe78a0ace94fb77727bf',
    //   client_id: '1000.IJSUXC1199E5GTAI0GHEJE879XP8YW',
    //   client_secret: '0cee3a6d8834f049675f471f2f0d284ecab590adc5',
    //   scope:
    //     'ZohoCRM.modules.all,Desk.tickets.ALL,Desk.contacts.ALL,ZohoSubscriptions.fullaccess.all,Desk.contacts.UPDATE',
    //   grant_type: 'refresh_token',
    // };
    const ZohoRequest = await axios.post(
      'https://accounts.zoho.in/oauth/v2/token?refresh_token=1000.188fa35ef745478a1a52062d37a453f4.7d990b72adc6daa21c24b80428896633&client_id=1000.IJSUXC1199E5GTAI0GHEJE879XP8YW&client_secret=0cee3a6d8834f049675f471f2f0d284ecab590adc5&scope=ZohoCRM.modules.all,Desk.tickets.ALL,Desk.contacts.ALL,ZohoSubscriptions.fullaccess.all,Desk.contacts.UPDATE&grant_type=refresh_token'
    );
    if (!ZohoRequest) {
      return res.status(404).json({ error: 'Zoho Token Creation Issue' });
    }

    const { access_token } = ZohoRequest.data;
    console.log('zoho token has been called', access_token);
    const existingToken = await Token.findOne();
    if (!existingToken) {
      return res.status(404).json({ error: 'Token not found' });
    }
    existingToken.BearerToken = access_token;
    await existingToken.save();
    const FullToken = 'Zoho-oauthtoken ' + access_token;
    return res.json({ token: FullToken });
  } catch (error) {
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/api/sendMessage', async (req, res) => {
  try {
    const { apiKey, campaignName, destination, userName, templateParams } =
      req.body;
    console.log(apiKey, campaignName, destination, userName, templateParams);
    const response = await axios.post(
      'https://backend.api-wa.co/campaign/flexiwaba/api',
      {
        apiKey,
        campaignName,
        destination,
        userName,
        templateParams,
      }
    );
    return res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
// app.post('/api/auth/Token', async (req, res) => {
//   try {
//     // Create a new Token document based on the request body
//     const newToken = new Token({
//       BearerToken: req.body.BearerToken, // Assuming the BearerToken is sent in the request body
//     });

//     // Save the new token to the database
//     await newToken.save();

//     // Respond with a success message
//     return res.json({ message: 'Token saved successfully', token: newToken });
//   } catch (error) {
//     // If an error occurs, respond with an error message
//     console.error(error);
//     return res.status(500).json({ error: 'Internal Server Error' });
//   }
// });

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
