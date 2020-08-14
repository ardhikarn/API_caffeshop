const { request, response } = require("express");
const {
  getAllOrder,
  getOrderById,
  postOrder,
  patchOrder,
  deleteOrder,
} = require("../models/model.order");
const helper = require("../helper/helper");

module.exports = {
  getAllOrder: async (request, response) => {
    try {
      const result = await getAllOrder();
      return helper.response(response, 200, "Success Get Data Order", result);
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
          `Success Get Data Order with id ${id}`,
          result
        );
      } else {
        return helper.response(response, 404, "Data Order Not Found");
      }
    } catch (error) {
      return helper.response(response, 400, "Bad Request", error);
    }
  },
  postOrder: async (request, response) => {
    try {
      const { category_name, category_status } = request.body;
      const addData = {
        category_name,
        category_created_at: new Date(),
        category_status,
      };
      const result = await postOrder(addData);
      return helper.response(response, 200, "Order Created", result);
    } catch (error) {
      return helper.response(response, 400, "Bad Request", error);
    }
  },
  patchOrder: async (request, response) => {
    try {
      const { id } = request.params;
      const { category_name, category_status } = request.body;
      const updateData = {
        category_name,
        category_updated_at: new Date(),
        category_status,
      };
      const checkId = await getOrderById(id);
      if (checkId.length > 0) {
        const result = await patchOrder(updateData, id);
        return helper.response(
          response,
          200,
          `Order id: ${id} Updated`,
          result
        );
      } else {
        return helper.response(response, 404, `Order id: ${id} not Found`);
      }
    } catch (error) {
      return helper.response(response, 400, "Bad Request", error);
    }
  },
  deleteOrder: async (request, response) => {
    try {
      const { id } = request.params;
      const result = await deleteOrder(id);
      return helper.response(response, 200, `Data id: ${id} Deleted`, result);
    } catch (error) {
      return helper.response(response, 400, "Bad Request", error);
    }
  },
};
