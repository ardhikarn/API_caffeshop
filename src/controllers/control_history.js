// Import object from model
const {
  getAllHistory,
  getHistoryCount,
  getHistoryById,
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
    page === "" ? (page = 1) : (page = parseInt(page));
    limit === "" ? (limit = 5) : (limit = parseInt(limit));
    if (sort === "") {
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
      console.log(result);
      if (result.length > 0) {
        return helper.response(
          response,
          200,
          "Success Get History",
          result,
          pageInfo
        );
      } else {
        return helper.response(
          response,
          404,
          "History not found",
          result,
          pageInfo
        );
      }
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
  // patchHistory: async (request, response) => {
  //   try {
  //     const { id } = request.params;
  //     const updateData = {
  //       history_subtotal: ,
  //     };
  //     console.log(updateData);
  //     const checkId = await getHistoryById(id);
  //     if (checkId.length > 0) {
  //       const result = await patchHistory(updateData);
  //       return helper.response(
  //         response,
  //         200,
  //         `History id: ${id} Updated`,
  //         result
  //       );
  //     } else {
  //       return helper.response(response, 404, `History id: ${id} not Found`);
  //     }
  //   } catch (error) {
  //     return helper.response(response, 400, "Bad Request", error);
  //   }
  // },
};
