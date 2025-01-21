const { verifyToken } = require("./../utils/jwt.js");

function Authenticated(req, res, nextFunction) {
  const authorization = req.headers.authorization;
  const split = authorization.split(" ");

  const data = verifyToken(split[1]);

  if (data) {
    req.user = data;
    nextFunction();
  } else {
    res.status(401).json({
      success: false,
      message: "Token is invalid.",
    });
  }
}
module.exports = {
  Authenticated,
};
