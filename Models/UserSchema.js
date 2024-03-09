const mongoose = require('mongoose');

const TokenSchema = new mongoose.Schema(
  {
    BearerToken: {
      type: String,
    },
  },
  { timestamps: true }
);

const Token = mongoose.model('Token', TokenSchema);
module.exports = Token;
