const {
  getProduct,
  getProductCount,
  getProductById,
  getProductByName,
  getProductCountByName,
  postProduct,
  patchProduct,
  deleteProduct,
} = require("../models/model_product");
const qs = require("querystring");
const helper = require("../helper/helper");
const redis = require("redis");
const client = redis.createClient();
const fs = require("fs");

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
    let { page, limit, sort } = request.query;
    page === "" || page === undefined ? (page = 1) : (page = parseInt(page));
    limit === "" || limit === undefined
      ? (limit = 6)
      : (limit = parseInt(limit));
    if (sort === "" || sort === undefined) {
      sort = "product_id";
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
      const result = await getProduct(sort, limit, offset);
      // proses set data result ke dalam redis
      if (result.length > 0) {
        const newResult = {
          result,
          pageInfo,
        };
        client.setex(
          `getProduct:${JSON.stringify(request.query)}`,
          3600,
          JSON.stringify(newResult)
        );
        return helper.response(
          response,
          200,
          "Success Get Data Product",
          result,
          pageInfo
        );
      } else {
        return helper.response(
          response,
          200,
          "Success Get Product",
          [],
          pageInfo
        );
      }
    } catch (error) {
      return helper.response(response, 400, "Bad Request", error);
    }
  },
  getProductByName: async (request, response) => {
    const { search } = request.query;
    const limit = 50;
    const totalData = await getProductCountByName(search);
    try {
      const searchResult = await getProductByName(search, limit);
      const result = {
        searchResult,
        totalData,
      };
      if (searchResult.length > 0) {
        client.setex(
          `searchproduct:${JSON.stringify(request.query)}`,
          3600,
          JSON.stringify(result)
        );
        return helper.response(response, 200, "Success Get Product", result);
      } else {
        return helper.response(response, 200, "Success Get Product", result);
      }
    } catch (error) {
      return helper.response(response, 400, "Bad Request", error);
    }
  },
  getProductById: async (request, response) => {
    try {
      const { id } = request.params;
      const result = await getProductById(id);
      if (result.length > 0) {
        client.setex(`getProductById:${id}`, 3600, JSON.stringify(result));
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
        category_id,
        product_status,
      } = request.body;
      const addData = {
        product_name,
        product_price,
        product_image: request.file === undefined ? "" : request.file.filename,
        category_id,
        product_created_at: new Date(),
        product_status,
      };
      if (
        addData.product_name === undefined ||
        addData.product_name === "" ||
        addData.product_image === undefined ||
        addData.product_image === "" ||
        addData.product_price === undefined ||
        addData.product_price === "" ||
        addData.category_id === undefined ||
        addData.category_id === "" ||
        addData.product_status === undefined ||
        addData.product_status === ""
      ) {
        return helper.response(
          response,
          400,
          "Form data must be complete",
          null
        );
      }
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
        category_id,
        product_status,
      } = request.body;
      const product_image = request.file;
      if (
        product_name == undefined ||
        product_name == "" ||
        product_price == undefined ||
        product_price == "" ||
        category_id == undefined ||
        category_id == "" ||
        product_status == undefined ||
        product_status == ""
      ) {
        return helper.response(
          response,
          400,
          "Form data must be complete",
          null
        );
      }
      const checkId = await getProductById(id);
      const updateData = {
        product_name,
        product_price,
        category_id,
        product_updated_at: new Date(),
        product_status,
      };
      if (product_image === "" || product_image === undefined) {
        try {
          const result = await patchProduct(updateData, id);
          return helper.response(response, 201, "Product Updated", result);
        } catch (error) {
          return helper.response(response, 400, "Bad Request", error);
        }
      } else {
        try {
          const image = checkId[0].product_image;
          fs.unlink(`./uploads/${image}`, function (error) {
            if (error) throw error;
          });
          updateData.product_image = product_image.filename;
          const result = await patchProduct(updateData, id);
          return helper.response(response, 201, "Product Updated", result);
        } catch (error) {
          return helper.response(response, 400, "Bad Request", error);
        }
      }
    } catch (error) {
      return helper.response(response, 400, "Bad Request", error);
    }
  },
  deleteProduct: async (request, response) => {
    try {
      const { id } = request.params;
      const checkId = await getProductById(id);
      if (checkId.length > 0) {
        const result = await deleteProduct(id);
        const image = checkId[0].product_image;
        fs.unlink(`./uploads/${image}`, function (error) {
          if (error) throw error;
        });
        return helper.response(response, 201, "Product Deleted", result);
      } else {
        return helper.response(response, 404, `Product By Id ${id} not Found`);
      }
    } catch (e) {
      return helper.response(response, 400, "Bad Request", e);
    }
  },
};
