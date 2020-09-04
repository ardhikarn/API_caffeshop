const redis = require("redis");
const client = redis.createClient();
const helper = require("../helper/helper");

module.exports = {
  getProductByIdRedis: (request, response, next) => {
    const { id } = request.params;
    client.get(`getproductbyid:${id}`, (error, result) => {
      if (!error && result != null) {
        // console.log("data ada di dalam redis");
        return helper.response(response, 200, JSON.parse(result));
      } else {
        // console.log("data tidak ada di dalam redis");
        next();
      }
    });
  },
  getProductRedis: (request, response, next) => {
    client.get(
      `getproduct:${JSON.stringify(request.query)}`,
      (error, result) => {
        if (!error && result != null) {
          return helper.response(response, 200, JSON.parse(result));
        } else {
          next();
        }
      }
    );
  },
  clearDataRedist: (request, response, next) => {
    client.flushall((error, result) => {
      console.log(result);
    });
    next();
  },
};
