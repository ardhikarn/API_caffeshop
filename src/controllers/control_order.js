const {
  getAllOrder,
  getOrderCount,
  getOrderById,
  getOrderByHistoryId,
  postOrder,
} = require("../models/model_order");
const {
  getHistoryById,
  postHistory,
  patchHistory,
} = require("../models/model_history");
const { getProductById } = require("../models/model_product");
const qs = require("querystring");
const helper = require("../helper/helper");

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
  getAllOrder: async (request, response) => {
    let { page, limit, sort } = request.query;
    page === "" || page === undefined ? (page = 1) : (page = parseInt(page));
    limit === "" || limit === undefined
      ? (limit = 5)
      : (limit = parseInt(limit));
    const totalData = await getOrderCount();
    if (sort === "" || sort === undefined) {
      sort = "order_id";
    }
    const totalPage = Math.ceil(totalData / limit);
    const offset = page * limit - limit;
    const prevLink = getPrevLink(page, request.query);
    const nextLink = getNextLink(page, totalPage, request.query);
    const pageInfo = {
      page,
      totalPage,
      limit,
      totalData,
      prevLink: prevLink && `http://127.0.0.1:3000/order?${prevLink}`,
      nextLink: nextLink && `http://127.0.0.1:3000/order?${nextLink}`,
    };
    try {
      const result = await getAllOrder(sort, limit, offset);
      if (result.length > 0) {
        return helper.response(
          response,
          200,
          "Get Order Success",
          result,
          pageInfo
        );
      } else {
        return helper.response(
          response,
          404,
          "Order Not Found",
          result,
          pageInfo
        );
      }
    } catch (error) {
      return helper.response(response, 400, "Bad Request", error);
    }
  },
  getOrderById: async (request, response) => {
    try {
      const { id } = request.params;
      const result = await getOrderById(id);
      if (result.length > 0) {
        return helper.response(
          response,
          200,
          `Get Order id: ${id} Success`,
          result
        );
      } else {
        return helper.response(
          response,
          404,
          `Order id: ${id} Not Found`,
          result
        );
      }
    } catch (error) {
      return helper.response(response, 400, "Bad Request", error);
    }
  },
  postOrder: async (request, response) => {
    try {
      // menentukan random invoice
      const history_invoice = Math.floor(100000 + Math.random() * 900000);
      const setData = {
        history_invoice,
        history_subtotal: 0,
        history_created_at: new Date(),
      };
      const result = await postHistory(setData);
      // console.log(result);
      // mendapatkan history_id
      const historyId = result.insertId;
      // utk mengambil data di raw postman
      const orders = request.body;
      let subTotal = 0;
      for (let i = 0; i < orders.length; i++) {
        const product_id = orders[i].product_id;
        const order_qty = orders[i].order_qty;

        // mengambil product price
        const getProduct = await getProductById(product_id);
        const productPrice = getProduct[0].product_price;
        const setDataOrder = {
          history_id: historyId,
          product_id,
          order_qty,
          order_total_price: order_qty * productPrice,
        };
        const result2 = await postOrder(setDataOrder);
        subTotal += result2.order_total_price;
      }
      // const ppn = subTotal * 0.1;
      const history_subtotal = subTotal + subTotal * 0.1;
      const setData3 = {
        history_subtotal,
      };
      await patchHistory(setData3, historyId);
      const dataHistory = await getHistoryById(historyId);
      const dataOrders = await getOrderByHistoryId(historyId);
      // console.log(dataOrders);
      const printOrder = {
        history_id: dataHistory[0].history_id,
        invoice: dataHistory[0].history_invoice,
        orders: dataOrders,
        // ppn,
        subtotal: dataHistory[0].history_subtotal,
        history_created_at: dataHistory[0].history_created_at,
      };
      return helper.response(response, 200, "Order Created", printOrder);
    } catch (error) {
      return helper.response(response, 400, "Bad Request", error);
    }
  },
};
