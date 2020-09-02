const connection = require("../config/mysql");
const { reject } = require("bcrypt/promises");

module.exports = {
  postUser: (addData) => {
    return new Promise((resolve, reject) => {
      connection.query("INSERT INTO user SET ?", addData, (error, result) => {
        if (!error) {
          const newResult = {
            id: result.insertId,
            ...addData,
          };
          // untuk menghapus user_password
          delete newResult.user_password;
          resolve(newResult);
        } else {
          reject(new Error(error));
        }
      });
    });
  },
  checkUser: (email) => {
    return new Promise((resolve, reject) => {
      connection.query(
        "SELECT user_id, user_email, user_password, user_name, user_role, user_status FROM user WHERE user_email = ?",
        email,
        (error, result) => {
          !error ? resolve(result) : reject(new Error(error));
        }
      );
    });
  },
};
