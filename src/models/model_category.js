const connection = require("../config/mysql");

module.exports = {
  getAllCategory: () => {
    return new Promise((resolve, reject) => {
      connection.query("SELECT * FROM category", (error, result) => {
        !error ? resolve(result) : reject(new Error(error));
      });
    });
  },
  getCategoryById: (id) => {
    return new Promise((resolve, reject) => {
      connection.query(
        "SELECT * FROM category WHERE category_id = ?",
        id,
        (error, result) => {
          !error ? resolve(result) : reject(new Error(error));
        }
      );
    });
  },
  postCategory: (addData) => {
    return new Promise((resolve, reject) => {
      connection.query(
        "INSERT INTO category SET ?",
        addData,
        (error, result) => {
          if (!error) {
            const newResult = {
              category_id: result.insertId,
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
  patchCategory: (updateData, id) => {
    return new Promise((resolve, reject) => {
      connection.query(
        "UPDATE category SET ? WHERE category_id = ?",
        [updateData, id],
        (error, result) => {
          if (!error) {
            const newResult = {
              category_id: id,
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
  deleteCategory: (id) => {
    return new Promise((resolve, reject) => {
      connection.query(
        "DELETE FROM category WHERE category_id = ?",
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
