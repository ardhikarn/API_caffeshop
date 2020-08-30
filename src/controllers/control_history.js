// Import object from model
const {
  getAllHistory,
  getHistoryCount,
  getHistoryById,
  getHistoryToday,
  getHistoryMonth,
  getHistoryWeek,
  getHistoryTotalIncome,
  // patchHistory,
} = require("../models/model_history");
const { getOrderByHistoryId } = require("../models/model_order");

// Import query string
const qs = require("querystring");

// Import helper
const helper = require("../helper/helper");
const { request, response } = require("express");
const { checkout } = require("../routes/route_order");

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
      ? (limit = 5)
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
      console.log(result);
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
      const result = {
        history_id: dataHistory[0].history_id,
        invoice: dataHistory[0].history_invoice,
        orders: dataOrder,
        subtotal: dataHistory[0].history_subtotal,
        history_created_at: dataHistory[0].history_created_at,
      };
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
      return helper.response(response, 200, "Success Get History", result);
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
      return helper.response(response, 200, "Success Get History", result);
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
      return helper.response(response, 200, "Success Get History", result);
    } catch (error) {
      return helper.response(response, 400, "Bad Request", error);
    }
  },
  getHistoryTotalIncome: async (request, response) => {
    try {
      const { date } = request.query;
      const result = await getHistoryTotalIncome(date);
      return helper.response(response, 200, "Success Get Total Income", result);
    } catch (error) {
      return helper.response(response, 400, "Bad Request", error);
    }
  },
};
