const dotenv = require('dotenv');
dotenv.config();

module.exports = {
  PORT: Number(process.env.PORT) || 3000,
  SERVER: "127.0.0.1",
  credentials: process.env.CREDENTIALS || '*'
};
