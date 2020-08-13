const { request } = require("express");
const {
  getAllProduct,
  getProductById,
  getProductByName,
  postProduct,
  patchProduct,
  deleteProduct,
} = require("../models/model_product");
const helper = require("../helper/helper");

module.exports = {
  getAllProduct: async (request, response) => {
    try {
      const result = await getAllProduct();
      return helper.response(response, 200, "Success Get Data Product", result);
    } catch (error) {
      return helper.response(response, 400, "Bad Request", error);
    }
  },
  getProductById: async (request, response) => {
    try {
      const { id } = request.params;
      const result = await getProductById(id);
      if (result.length > 0) {
        return helper.response(
          response,
          200,
          `Success Get Data Product with id ${id}`,
          result
        );
      } else {
        return helper.response(response, 404, "Data Product Not Found");
      }
    } catch (error) {
      return helper.response(response, 400, "Bad Request", error);
    }
  },
  getProductByName: async (request, response) => {
    try {
    } catch (error) {}
  },
  postProduct: async (request, response) => {
    try {
      const {
        category_id,
        product_name,
        product_price,
        product_image,
        product_status,
      } = request.body;
      const addData = {
        category_id,
        product_name,
        product_price,
        product_image,
        product_created_at: new Date(),
        product_status,
      };
      const result = await postProduct(addData);
      return helper.response(response, 200, "Product Created", result);
    } catch (error) {
      return helper.response(response, 400, "Bad Request", error);
    }
  },
  patchProduct: async (request, response) => {
    try {
      const { id } = request.params;
      const {
        category_id,
        product_name,
        product_price,
        product_image,
        product_status,
      } = request.body;
      const updateData = {
        category_id,
        product_name,
        product_price,
        product_image,
        product_updated_at: new Date(),
        product_status,
      };
      const checkId = await getProductById(id);
      if (checkId.length > 0) {
        const result = await patchProduct(updateData, id);
        return helper.response(
          response,
          200,
          `Product id: ${id} Updated`,
          result
        );
      } else {
        return helper.response(response, 404, `Product id: ${id} not Found`);
      }
    } catch (error) {
      return helper.response(response, 400, "Bad Request", error);
    }
  },
  deleteProduct: async (request, response) => {
    try {
      const { id } = request.params;
      const result = await deleteProduct(id);
      return helper.response(
        response,
        200,
        `Data id: ${id} Deleted`,
        getAllProduct()
      );
    } catch (error) {
      return helper.response(response, 400, "Bad Request", error);
    }
  },
};
