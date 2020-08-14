// butuh connection dari mysql jadi harus import dari config
const connection = require("../config/mysql");

module.exports = {
  getAllProduct: () => {
    return new Promise((resolve, reject) => {
      connection.query("SELECT * FROM product", (error, result) => {
        !error ? resolve(result) : reject(new Error(error));
      });
    });
  },
  getProductById: (id) => {
    return new Promise((resolve, reject) => {
      connection.query(
        "SELECT * FROM product WHERE product_id = ?",
        id,
        (error, result) => {
          !error ? resolve(result) : reject(new Error(error));
        }
      );
    });
  },
  getProductByName: (addData) => {
    return new Promise((resolve, reject) => {});
  },
  postProduct: (addData) => {
    return new Promise((resolve, reject) => {
      connection.query(
        "INSERT INTO product SET ?",
        addData,
        (error, result) => {
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
