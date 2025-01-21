const jwt = require("jsonwebtoken");
const secretKey = "MYSECRETKEY";
// Convert Data to token jwt

function generateToken(data) {
  return jwt.sign(data, secretKey, { expiresIn: "1d" });
}
function verifyToken(token) {
  return jwt.verify(token, secretKey);
}

module.exports = { generateToken, verifyToken };
