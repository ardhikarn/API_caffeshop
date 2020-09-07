const connection = require("../config/mysql");

module.exports = {
  getUser: (limit, offset, search, sort, ascDesc) => {
    return new Promise((resolve, reject) => {
      connection.query(
        `SELECT * FROM user WHERE user_email LIKE "%${search}%" ORDER BY ${sort} ${ascDesc} LIMIT ${limit} OFFSET ${offset}`,
        (error, result) => {
          !error ? resolve(result) : reject(new Error(error));
        }
      );
    });
  },
  getUserCount: () => {
    return new Promise((resolve, reject) => {
      connection.query(
        "SELECT COUNT(*) as total FROM user",
        (error, result) => {
          !error ? resolve(result[0].total) : reject(new Error(error));
        }
      );
    });
  },
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
  getUserById: (id) => {
    return new Promise((resolve, reject) => {
      connection.query(
        `SELECT user_id, user_email, user_name, user_role, user_status, user_updated_at FROM user WHERE user_id = ${id}`,
        (error, result) => {
          !error ? resolve(result) : reject(new Error(error));
        }
      );
    });
  },
  patchUser: (updateUser, id) => {
    return new Promise((resolve, reject) => {
      connection.query(
        "UPDATE user SET ? WHERE user_id = ?",
        [updateUser, id],
        (error, result) => {
          if (!error) {
            const newResult = {
              user_id: id,
              ...updateUser,
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
