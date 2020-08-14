const { request, response } = require("express");
const {
  getAllHistory,
  getHistoryById,
  postHistory,
  patchHistory,
  deleteHistory,
} = require("../models/model_history");
const helper = require("../helper/helper");

module.exports = {
  getAllHistory: async (request, response) => {
    try {
      const result = await getAllHistory();
      return helper.response(response, 200, "Success Get Data History", result);
    } catch (error) {
      return helper.response(response, 400, "Bad Request", error);
    }
  },
  getHistoryById: async (request, response) => {
    try {
      const { id } = request.params;
      const result = await getHistoryById(id);
      if (result.length > 0) {
        return helper.response(
          response,
          200,
          `Success Get Data History with id ${id}`,
          result
        );
      } else {
        return helper.response(response, 404, "Data History Not Found");
      }
    } catch (error) {
      return helper.response(response, 400, "Bad Request", error);
    }
  },
  postHistory: async (request, response) => {
    try {
      const {
        history_invoice,
        order_id,
        product_name,
        order_qty,
        order_total_price,
        history_subtotal,
      } = request.body;
      const addData = {
        history_invoice,
        order_id,
        product_name,
        order_qty,
        order_total_price,
        history_subtotal,
        category_created_at: new Date(),
      };
      const result = await postHistory(addData);
      return helper.response(response, 200, "Category Created", result);
    } catch (error) {
      return helper.response(response, 400, "Bad Request", error);
    }
  },
  patchHistory: async (request, response) => {
    try {
      const { id } = request.params;
      const {
        history_invoice,
        order_id,
        product_name,
        order_qty,
        order_total_price,
        history_subtotal,
      } = request.body;
      const updateData = {
        history_invoice,
        order_id,
        product_name,
        order_qty,
        order_total_price,
        history_subtotal,
        category_updated_at: new Date(),
      };
      const checkId = await getHistoryById(id);
      if (checkId.length > 0) {
        const result = await patchHistory(updateData, id);
        return helper.response(
          response,
          200,
          `History id: ${id} Updated`,
          result
        );
      } else {
        return helper.response(response, 404, `History id: ${id} not Found`);
      }
    } catch (error) {
      return helper.response(response, 400, "Bad Request", error);
    }
  },
  deleteHistory: async (request, response) => {
    try {
      const { id } = request.params;
      const result = await deleteHistory(id);
      return helper.response(response, 200, `Data id: ${id} Deleted`, result);
    } catch (error) {
      return helper.response(response, 400, "Bad Request", error);
    }
  },
};
