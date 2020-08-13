const { request } = require("express");
const {
  getAllProduct,
  getProductByName,
  postProduct,
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
  getProductByName: async (request, response) => {
    try {
    } catch (error) {}
  },
  postProduct: async (request, response) => {
    try {
    } catch (error) {}
  },
  patchProduct: async (request, response) => {
    try {
    } catch (error) {}
  },
  deleteProduct: async (request, response) => {
    try {
    } catch (error) {}
  },
};
