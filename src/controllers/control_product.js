const { request } = require("express");
const {
  getProduct,
  getProductCount,
  getProductById,
  postProduct,
  patchProduct,
  deleteProduct,
} = require("../models/model_product");
const qs = require("querystring");
const helper = require("../helper/helper");
const { response } = require("../helper/helper");

const getPrevLink = (page, currentQuery) => {
  if (page > 1) {
    const generatedPage = {
      page: page - 1,
    };
    const resultPrevLink = {
      ...currentQuery,
      ...generatedPage,
    };
    return qs.stringify(resultPrevLink);
  } else {
    return null;
  }
};

const getNextLink = (page, totalPage, currentQuery) => {
  if (page < totalPage) {
    const generatedPage = {
      page: page + 1,
    };
    const resultNextLink = {
      ...currentQuery,
      ...generatedPage,
    };
    return qs.stringify(resultNextLink);
  } else {
    return null;
  }
};

module.exports = {
  getProduct: async (request, response) => {
    let { page, limit, search, sort, ascDesc } = request.query;
    page === "" || page === undefined ? (page = 1) : (page = parseInt(page));
    limit === "" || limit === undefined
      ? (limit = 5)
      : (limit = parseInt(limit));
    if (search === "" || search === undefined) {
      search = "";
    }
    if (sort === "" || sort === undefined) {
      sort = "product_id";
    }
    if (ascDesc === "" || ascDesc === undefined) {
      ascDesc = "ASC";
    }
    let totalData = await getProductCount();
    let totalPage = Math.ceil(totalData / limit);
    let offset = page * limit - limit;
    let prevLink = getPrevLink(page, request.query);
    let nextLink = getNextLink(page, totalPage, request.query);
    const pageInfo = {
      page,
      totalPage,
      limit,
      totalData,
      prevLink: prevLink && `http://127.0.0.1:3000/product?${prevLink}`,
      nextLink: nextLink && `http://127.0.0.1:3000/product?${nextLink}`,
    };
    try {
      const result = await getProduct(limit, offset, search, sort, ascDesc);
      return helper.response(
        response,
        200,
        "Success Get Data Product",
        result,
        pageInfo
      );
    } catch (error) {
      return helper.response(response, 400, "Bad Request", error);
    }
  },
  getProductById: async (request, response) => {
    try {
      // console.log(request.params);
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
  postProduct: async (request, response) => {
    try {
      const {
        product_name,
        product_price,
        product_image,
        category_id,
        product_status,
      } = request.body;
      const addData = {
        product_name,
        product_price,
        product_image,
        category_id,
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
        product_name,
        product_price,
        product_image,
        category_id,
        product_status,
      } = request.body;
      const updateData = {
        product_name,
        product_price,
        product_image,
        category_id,
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
      return helper.response(response, 200, `Data id: ${id} Deleted`);
    } catch (error) {
      return helper.response(response, 400, "Bad Request", error);
    }
  },
};
