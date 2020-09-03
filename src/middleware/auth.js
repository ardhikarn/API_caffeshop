const jwt = require("jsonwebtoken");
const helper = require("../helper/helper");

module.exports = {
  authorization: (request, response, next) => {
    let token = request.headers.authorization;
    if (token) {
      // validasi token jwt
      token = token.split(" ")[1];
      jwt.verify(token, "RAHASIA", (error, result) => {
        if (
          (error && error.name === "JsonWebTokenError") ||
          (error && error.name === "TokenExpiredError")
        ) {
          return helper.response(response, 403, error.message);
        } else {
          request.token = result;
          next();
        }
      });
    } else {
      return helper.response(response, 400, "Login First !!!");
    }
  },
  authorizationAdmin: (request, response, next) => {
    let token = request.headers.authorization;
    if (token) {
      token = token.split(" ")[1];
      jwt.verify(token, "RAHASIA", (error, result) => {
        if (
          (error && error.name === "JsonWebTokenError") ||
          (error && error.name === "TokenExpiredError")
        ) {
          return helper.response(response, 403, error.message);
        } else {
          // pengkondisian post, patch, delete hanya user_role 1 yaitu Admin.
          if (result.user_role === 2) {
            return helper.response(response, 403, "Admin Handle");
          } else {
            request.token = result;
            next();
          }
        }
      });
    } else {
      return helper.response(response, 400, "Login First !");
    }
  },
};
