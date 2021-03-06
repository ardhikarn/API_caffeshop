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
      if (result.length > 0) {
        client.setex("getCategory", 3600, JSON.stringify(result));
        return helper.response(
          response,
          200,
          "Success Get Data Category",
          result
        );
      } else {
        return helper.response(response, 200, "Get All Category", []);
      }
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
        return helper.response(
          response,
          404,
          `Data Category id ${id} Not Found`,
          result
        );
      }
    } catch (error) {
      return helper.response(response, 400, "Bad Request", error);
    }
  },
  postCategory: async (request, response) => {
    try {
      const { category_name, category_status } = request.body;
      if (category_name === "" || category_status === "") {
        return helper.response(
          response,
          201,
          "Category name and Category status are required"
        );
      }
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
      if (category_name === "" || category_status === "") {
        return helper.response(
          response,
          201,
          "Category name and Category status are required"
        );
      }
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
      const checkId = await getCategoryById(id);
      if (checkId.length > 0) {
        const result = await deleteCategory(id);
        return helper.response(
          response,
          201,
          `Category id: ${id} Deleted`,
          result
        );
      } else {
        return helper.response(response, 404, `Category id: ${id} Not Found`);
      }
    } catch (error) {
      return helper.response(response, 400, "Bad Request", error);
    }
  },
};
