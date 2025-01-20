const jwt = require("jsonwebtoken");
const privateKey = "mySecretKey";
function encode(username, userId) {
  const encoded = jwt.sign(
    {
      username,
      userId,
    },
    privateKey,
    {
      expiresIn: "1d",
    }
  );
  return encoded;
}
function decode(token) {
  return jwt.verify(token, privateKey);
}
module.exports = {
  encode,
  decode,
};