const jwt = require("jsonwebtoken");

module.exports.verifyToken = (req, res, next) => {
  const token = req.cookies.access_token;
  if (!token) {
    return next((401, "You are not authenticated!"));
  }

  jwt.verify(token, process.env.JWT, (err, user) => {
    if (err) return next((403, "Token is not valid!"));
    req.user = user;
    if (req.user.id === req.params.id) {
      next();
    } else {
      return next((403, "You are not authorized!"));
    }
  });
};

module.exports.verifyUser = (req, res, next) => {
  module.exports.verifyToken(req, res, next, () => {
    if (req.user.id === req.params.id) {
      next();
    } else {
      return next((403, "You are not authorized!"));
    }
  });
};
