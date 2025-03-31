const { verifyToken } = require("./../utils/jwt.js");

function Authenticated(req, res, nextFunction) {
  const authorization = req.headers.authorization;
  const split = authorization.split(" ");

  const data = verifyToken(split[1]);

  if (data) {
    if (data.role === "USER") {
      req.user = data;
      nextFunction();
    } else {
      res.status(401).json({
        success: false,
        message: "You are not authorized to access this resource.",
      });
    }
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
