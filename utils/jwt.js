const jwt = require("jsonwebtoken");
const secretKey = "fbebrl[bm-roefgmbore-gme[fgw,ea[]dfqw]aerd.]qwa";
// Convert Data to token jwt

function generateToken(data) {
  return jwt.sign(data, secretKey, { expiresIn: "1d" });
}
function verifyToken(token) {
  try {
    return jwt.verify(token, secretKey);
  } catch (e) {
    console.log({ message: e.message });
    return false;
  }
}

module.exports = { generateToken, verifyToken };
