const connection = require("../config/mysql");

module.exports = {
  getAllOrder: () => {
    return new Promise((resolve, reject) => {
      connection.query("SELECT * FROM order", (error, result) => {
        !error ? resolve(result) : reject(new Error(error));
      });
    });
  },
  getOrderById: (id) => {
    return new Promise((resolve, reject) => {
      connection.query(
        "SELECT * FROM order WHERE order_id = ?",
        id,
        (error, result) => {
          !error ? resolve(result) : reject(new Error(error));
        }
      );
    });
  },
  postOrder: (addData) => {
    return new Promise((resolve, reject) => {
      connection.query("INSERT INTO order SET ?", addData, (error, result) => {
        if (!error) {
          const newResult = {
            order_id: result.insertId,
            ...addData,
          };
          resolve(newResult);
        } else {
          reject(new Error(error));
        }
      });
    });
  },
  patchOrder: (updateData, id) => {
    return new Promise((resolve, reject) => {
      connection.query(
        "UPDATE order SET ? WHERE order_id = ?",
        [updateData, id],
        (error, result) => {
          if (!error) {
            const newResult = {
              order_id: id,
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
  deleteOrder: (id) => {
    return new Promise((resolve, reject) => {
      connection.query(
        "DELETE FROM order WHERE order_id = ?",
        id,
        (error, result) => {
          if (!error) {
            const newResult = {
              category_id: id,
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
