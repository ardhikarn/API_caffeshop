const redis = require("redis");
const client = redis.createClient();
const helper = require("../helper/helper");

module.exports = {
  // =============== REDIS PRODUCT ==================
  getProductByIdRedis: (request, response, next) => {
    const { id } = request.params;
    client.get(`getProductById:${id}`, (error, result) => {
      if (!error && result != null) {
        return helper.response(
          response,
          200,
          "Success Get Data",
          JSON.parse(result)
        );
      }
      next();
    });
  },
  getProductRedis: (request, response, next) => {
    client.get(
      `getProduct:${JSON.stringify(request.query)}`,
      (error, result) => {
        if (!error && result != null) {
          return helper.response(
            response,
            200,
            "Success Get Data",
            JSON.parse(result)
          );
        }
        next();
      }
    );
  },
  clearProductRedis: (request, response, next) => {
    client.keys("getProduct*", (error, result) => {
      if (result.length > 0) {
        result.forEach((value) => {
          client.del(value);
        });
      }
      next();
    });
  },
  // =============== REDIS CATEGORY ==================
  getCategoryIdRedis: (request, response, next) => {
    const { id } = request.params;
    client.get(`getCategoryId:${id}`, (error, result) => {
      if (!error && result != null) {
        return helper.response(
          response,
          200,
          "Succes Get Category By Id",
          JSON.parse(result)
        );
      }
      next();
    });
  },
  getCategoryRedis: (request, response, next) => {
    client.get("getCategory", (error, result) => {
      if (!error && result != null) {
        return helper.response(
          response,
          200,
          "Succes Get Category",
          JSON.parse(result)
        );
      }
      next();
    });
  },
  clearCategoryRedis: (request, response, next) => {
    client.keys("getCategory*", (error, result) => {
      if (result.length > 0) {
        result.forEach((value) => {
          client.del(value);
        });
      }
      next();
    });
  },
  // =============== REDIS ORDER ==================
  getOrderRedis: (request, response, next) => {
    client.get(`getOrder:${JSON.stringify(request.query)}`, (error, result) => {
      if (!error && result != null) {
        return helper.response(
          response,
          200,
          "Success Get Order",
          JSON.parse(result)
        );
      }
      next();
    });
  },
  getOrderIdRedis: (request, response, next) => {
    const { id } = request.params;
    client.get(`getOrderId:${id}`, (error, result) => {
      if (!error && result != null) {
        return helper.response(
          response,
          200,
          "Success Get Order",
          JSON.parse(result)
        );
      }
      next();
    });
  },
  clearOrderRedis: (request, response, next) => {
    client.keys("getOrder*", (error, result) => {
      if (result.length > 0) {
        result.forEach((value) => {
          client.del(value);
        });
      }
      next();
    });
  },
  // =============== REDIS HISTORY ==================
  getHistoryRedis: (request, response, next) => {
    client.get(
      `getHistory:${JSON.stringify(request.query)}`,
      (error, result) => {
        if (!error && result != null) {
          return helper.response(
            response,
            200,
            "Success Get History",
            JSON.parse(result)
          );
        }
        next();
      }
    );
  },
  getHistoryIdRedis: (request, response, next) => {
    const { id } = request.params;
    client.get(`getHistoryId:${id}`, (error, result) => {
      if (!error && result != null) {
        return helper.response(
          response,
          200,
          "Success Get History Id",
          JSON.parse(result)
        );
      }
      next();
    });
  },
  getHistoryTodayRedis: (request, response, next) => {
    client.get("getHistoryToday", (error, result) => {
      if (!error && result != null) {
        return helper.response(
          response,
          200,
          "Success Get History Today",
          JSON.parse(result)
        );
      }
      next();
    });
  },
  getHistoryWeekRedis: (request, response, next) => {
    client.get("getHistoryWeek", (error, result) => {
      if (!error && result != null) {
        return helper.response(
          response,
          200,
          "Success Get History Week",
          JSON.parse(result)
        );
      }
      next();
    });
  },
  getHistoryMonthRedis: (request, response, next) => {
    client.get("getHistoryMonth", (error, result) => {
      if (!error && result != null) {
        return helper.response(
          response,
          200,
          "Success Get History Month",
          JSON.parse(result)
        );
      }
      next();
    });
  },
  getHistoryTodayIncomeRedis: (request, response, next) => {
    client.get("getHistoryTodayIncome", (error, result) => {
      if (!error && result != null) {
        return helper.response(
          response,
          200,
          "Success Get History Today Income",
          JSON.parse(result)
        );
      }
      next();
    });
  },
  getHistoryCountWeekRedis: (request, response, next) => {
    client.get("getHistoryCountWeek", (error, result) => {
      if (!error && result != null) {
        return helper.response(
          response,
          200,
          "Success Get History Count Week",
          JSON.parse(result)
        );
      }
      next();
    });
  },
  getHistoryYearIncomeRedis: (request, response, next) => {
    client.get("getHistoryYearIncome", (error, result) => {
      if (!error && result != null) {
        return helper.response(
          response,
          200,
          "Success Get History Year Income",
          JSON.parse(result)
        );
      }
      next();
    });
  },
  getHistoryChartMonth: (request, response, next) => {
    client.get("getHistoryChartMonth", (error, result) => {
      if (!error && result != null) {
        return helper.response(
          response,
          200,
          "Success Get History",
          JSON.parse(result)
        );
      }
      next();
    });
  },
  clearHistoryRedis: (request, response, next) => {
    client.keys("getHistory*", (error, result) => {
      if (result.length > 0) {
        result.forEach((value) => {
          client.del(value);
        });
      }
      next();
    });
  },
  // =============== REDIS USER ==================
  getUserRedis: (request, response, next) => {
    client.get(`getUser:${JSON.stringify(request.query)}`, (error, result) => {
      if (!error && result != null) {
        return helper.response(
          response,
          200,
          "Success Get Data User",
          JSON.parse(result)
        );
      }
      next();
    });
  },
};
