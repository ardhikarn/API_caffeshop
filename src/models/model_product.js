// butuh connection dari mysql jadi harus import dari config
const connection = require("../config/mysql");

module.exports = {
  getProduct: (limit, offset, search, sort) => {
    return new Promise((resolve, reject) => {
      connection.query(
        `SELECT * FROM product WHERE product_name LIKE "%${search}%" ORDER BY ${sort} ASC LIMIT ? OFFSET ?`,
        [limit, offset],
        (error, result) => {
          !error ? resolve(result) : reject(new Error(error));
        }
      );
    });
  },
  getProductCount: () => {
    return new Promise((resolve, reject) => {
      connection.query(
        "SELECT COUNT(*) as total FROM product",
        (error, result) => {
          !error ? resolve(result[0].total) : reject(new Error(error));
        }
      );
    });
  },
  getProductById: (id) => {
    return new Promise((resolve, reject) => {
      connection.query(
        `SELECT product.product_id, product.product_name, product.product_image, product.product_price, 
        category.category_name, product.product_created_at, product.product_updated_at, product.product_status FROM product 
        INNER JOIN category ON product.category_id = category.category_id WHERE product_id = ${id}`,
        (error, result) => {
          !error ? resolve(result) : reject(new Error(error));
        }
      );
    });
  },
  postProduct: (addData) => {
    return new Promise((resolve, reject) => {
      connection.query(
        "INSERT INTO product SET ?",
        addData,
        (error, result) => {
          // console.log(result);
          if (!error) {
            const newResult = {
              product_id: result.insertId,
              ...addData,
            };
            resolve(newResult);
          } else {
            reject(new Error(error));
          }
        }
      );
    });
  },
  patchProduct: (updateData, id) => {
    return new Promise((resolve, reject) => {
      connection.query(
        "UPDATE product SET ? WHERE product_id = ?",
        [updateData, id],
        (error, result) => {
          if (!error) {
            const newResult = {
              product_id: id,
              ...updateData,
            };
            resolve(newResult);
          } else {
            reject(new Error(error));
          }
        }
      );
    });
  },
  deleteProduct: (id) => {
    return new Promise((resolve, reject) => {
      connection.query(
        "DELETE FROM product WHERE product_id = ?",
        id,
        (error, result) => {
          if (!error) {
            const newResult = {
              product_id: id,
            };
            resolve(newResult);
          } else {
            reject(new Error(error));
          }
        }
      );
    });
  },
};
