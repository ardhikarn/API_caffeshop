const { request, response } = require("express");
const {
  getAllCategory,
  getCategoryById,
  postCategory,
  patchCategory,
  deleteCategory,
} = require("../models/model_category");
const helper = require("../helper/helper");
const redis = require("redis");
const client = redis.createClient();

module.exports = {
  getAllCategory: async (request, response) => {
    try {
      const result = await getAllCategory();
      client.setex("getCategory", 3600, JSON.stringify(result));
      return helper.response(
        response,
        200,
        "Success Get Data Category",
        result
      );
    } catch (error) {
      return helper.response(response, 400, "Bad Request", error);
    }
  },
  getCategoryById: async (request, response) => {
    try {
      const { id } = request.params;
      const result = await getCategoryById(id);
      if (result.length > 0) {
        client.setex(`getCategoryId:${id}`, 3600, JSON.stringify(result));
        return helper.response(
          response,
          200,
          `Success Get Data Category with id ${id}`,
          result
        );
      } else {
        return helper.response(response, 404, "Data Category Not Found");
      }
    } catch (error) {
      return helper.response(response, 400, "Bad Request", error);
    }
  },
  postCategory: async (request, response) => {
    try {
      const { category_name, category_status } = request.body;
      const addData = {
        category_name,
        category_created_at: new Date(),
        category_status,
      };
      const result = await postCategory(addData);
      return helper.response(response, 200, "Category Created", result);
    } catch (error) {
      return helper.response(response, 400, "Bad Request", error);
    }
  },
  patchCategory: async (request, response) => {
    try {
      const { id } = request.params;
      const { category_name, category_status } = request.body;
      const updateData = {
        category_name,
        category_updated_at: new Date(),
        category_status,
      };
      const checkId = await getCategoryById(id);
      if (checkId.length > 0) {
        const result = await patchCategory(updateData, id);
        return helper.response(
          response,
          200,
          `Category id: ${id} Updated`,
          result
        );
      } else {
        return helper.response(response, 404, `Category id: ${id} not Found`);
      }
    } catch (error) {
      return helper.response(response, 400, "Bad Request", error);
    }
  },
  deleteCategory: async (request, response) => {
    try {
      const { id } = request.params;
      const result = await deleteCategory(id);
      return helper.response(
        response,
        200,
        `Category id: ${id} Deleted`,
        result
      );
    } catch (error) {
      return helper.response(response, 400, "Bad Request", error);
    }
  },
};
