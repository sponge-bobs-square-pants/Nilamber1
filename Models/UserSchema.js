const mongoose = require('mongoose');

const TokenSchema = new mongoose.Schema(
  {
    BearerToken: {
      type: String,
    },
  },
  { timestamps: true }
);

const Token = mongoose.model('tokens', TokenSchema);
module.exports = Token;
