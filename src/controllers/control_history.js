const {
  getAllHistory,
  getHistoryCount,
  getHistoryById,
  getHistoryToday,
  getHistoryWeek,
  getHistoryMonth,
  getHistoryTodayIncome,
  getCountHistoryWeek,
  getHistoryYearIncome,
  getHistoryChartThisMonth,
} = require("../models/model_history");
const { getOrderByHistoryId } = require("../models/model_order");
const qs = require("querystring");
const helper = require("../helper/helper");
const redis = require("redis");
const client = redis.createClient();

// Pagination
const getPrevLink = (page, currentQuery) => {
  if (page > 1) {
    const generatePage = {
      page: page - 1,
    };
    const resultPrevLink = { ...currentQuery, ...generatePage };
    return qs.stringify(resultPrevLink);
  } else {
    return null;
  }
};

const getNextLink = (page, totalPage, currentQuery) => {
  if (page < totalPage) {
    const generatePage = {
      page: page + 1,
    };
    const resultPrevLink = { ...currentQuery, ...generatePage };
    return qs.stringify(resultPrevLink);
  } else {
    return null;
  }
};

module.exports = {
  getAllHistory: async (request, response) => {
    let { page, limit, sort } = request.query;
    page === "" || page === undefined ? (page = 1) : (page = parseInt(page));
    limit === "" || limit === undefined
      ? (limit = 6)
      : (limit = parseInt(limit));
    if (sort === "" || sort === undefined) {
      sort = "history_id";
    }
    const totalData = await getHistoryCount();
    const totalPage = Math.ceil(totalData / limit);
    const offset = page * limit - limit;
    const prevLink = getPrevLink(page, request.query);
    const nextLink = getNextLink(page, totalPage, request.query);

    const pageInfo = {
      page,
      totalPage,
      limit,
      totalData,
      prevLink: prevLink && `http://127.0.0.1:3000/history?${prevLink}`,
      nextLink: nextLink && `http://127.0.0.1:3000/history?${nextLink}`,
    };
    try {
      const result = await getAllHistory(limit, offset, sort);
      // untuk menampilkan orders
      for (let i = 0; i < result.length; i++) {
        result[i].orders = await getOrderByHistoryId(result[i].history_id);
        let total = 0;
        result[i].orders.forEach((value) => {
          total += value.order_total_price;
        });
        result[i].allTotalPriceOrder = total;
        const ppn = (total * 10) / 100;
        result[i].ppn = ppn;
      }
      const newResult = {
        result,
        pageInfo,
      };
      client.setex(
        `getHistory:${JSON.stringify(request.query)}`,
        3600,
        JSON.stringify(newResult)
      );
      return helper.response(
        response,
        200,
        "Success Get History",
        result,
        pageInfo
      );
    } catch (error) {
      return helper.response(response, 400, "Bad Request", error);
    }
  },
  getHistoryById: async (request, response) => {
    try {
      const { id } = request.params;
      const dataHistory = await getHistoryById(id);
      const dataOrder = await getOrderByHistoryId(id);
      let total = 0;
      dataOrder.forEach((value) => {
        total += value.order_total_price;
      });
      const ppn = (total * 10) / 100;
      const result = {
        history_id: dataHistory[0].history_id,
        invoice: dataHistory[0].history_invoice,
        orders: dataOrder,
        ppn,
        subtotal: dataHistory[0].history_subtotal,
        history_created_at: dataHistory[0].history_created_at,
      };
      client.setex(`getHistoryId:${id}`, 3600, JSON.stringify(result));
      return helper.response(
        response,
        200,
        `Get History id: ${id} Success`,
        result
      );
    } catch (error) {
      return helper.response(response, 400, "Bad Request", error);
    }
  },
  getHistoryToday: async (request, response) => {
    try {
      const result = await getHistoryToday();
      for (let i = 0; i < result.length; i++) {
        result[i].orders = await getOrderByHistoryId(result[i].history_id);
        let total = 0;
        result[i].orders.forEach((value) => {
          total += value.order_total_price;
        });
        result[i].allTotalPriceOrder = total;
        const ppn = (total * 10) / 100;
        result[i].ppn = ppn;
      }
      client.setex("getHistoryToday", 3600, JSON.stringify(result));
      return helper.response(
        response,
        200,
        "Success Get History Orders Today",
        result
      );
    } catch (error) {
      return helper.response(response, 400, "Bad Request", error);
    }
  },

  getHistoryWeek: async (request, response) => {
    try {
      const result = await getHistoryWeek();
      for (let i = 0; i < result.length; i++) {
        result[i].orders = await getOrderByHistoryId(result[i].history_id);
        let total = 0;
        result[i].orders.forEach((value) => {
          total += value.order_total_price;
        });
        result[i].allTotalPriceOrder = total;
        const ppn = total * 0.1;
        result[i].ppn = ppn;
      }
      client.setex("getHistoryWeek", 3600, JSON.stringify(result));
      return helper.response(
        response,
        200,
        "Success Get History Orders Week",
        result
      );
    } catch (error) {
      return helper.response(response, 400, "Bad Request", error);
    }
  },
  getHistoryMonth: async (request, response) => {
    try {
      const result = await getHistoryMonth();
      for (let i = 0; i < result.length; i++) {
        result[i].orders = await getOrderByHistoryId(result[i].history_id);
        let total = 0;
        result[i].orders.forEach((value) => {
          total += value.order_total_price;
        });
        result[i].allTotalPriceOrder = total;
        const ppn = total * 0.1;
        result[i].ppn = ppn;
      }
      client.setex("getHistoryMonth", 3600, JSON.stringify(result));
      return helper.response(
        response,
        200,
        "Success Get History Orders Month",
        result
      );
    } catch (error) {
      return helper.response(response, 400, "Bad Request", error);
    }
  },
  getHistoryTodayIncome: async (request, response) => {
    try {
      const result = await getHistoryTodayIncome();
      client.setex("getHistoryTodayIncome", 3600, JSON.stringify(result));
      return helper.response(response, 200, "Success Get Total Income", result);
    } catch (error) {
      return helper.response(response, 400, "Bad Request", error);
    }
  },
  getCountHistoryWeek: async (request, response) => {
    try {
      const result = await getCountHistoryWeek();
      client.setex("getHistoryCountWeek", 3600, JSON.stringify(result));
      return helper.response(
        response,
        200,
        "Success Count Week Orders",
        result
      );
    } catch (error) {
      return helper.response(response, 400, "Bad Request", error);
    }
  },
  getHistoryYearIncome: async (request, response) => {
    try {
      const result = await getHistoryYearIncome();
      client.setex("getHistoryYearIncome", 3600, JSON.stringify(result));
      return helper.response(
        response,
        200,
        "Success Get Total Year Income",
        result
      );
    } catch (error) {
      return helper.response(response, 400, "Bad Request", error);
    }
  },
  getHistoryChartThisMonth: async (request, response) => {
    try {
      const result = await getHistoryChartThisMonth();
      client.setex("getHistoryChartMonth", 3600, JSON.stringify(result));
      return helper.response(
        response,
        200,
        "Success Get Data Chart This Month",
        result
      );
    } catch (error) {
      return helper.response(response, 400, "Bad Request", error);
    }
  },
};
