// Import connection from config
const connection = require("../config/mysql");

module.exports = {
  getAllHistory: (limit, offset, sort) => {
    return new Promise((resolve, reject) => {
      connection.query(
        `SELECT * FROM history ORDER BY ${sort} LIMIT ? OFFSET ?`,
        [limit, offset],
        (error, result) => {
          !error ? resolve(result) : reject(new Error(error));
        }
      );
    });
  },
  getHistoryCount: () => {
    return new Promise((resolve, reject) => {
      connection.query(
        "SELECT COUNT(*) as total FROM history",
        (error, result) => {
          !error ? resolve(result[0].total) : reject(new Error(error));
        }
      );
    });
  },
  getHistoryById: (id) => {
    return new Promise((resolve, reject) => {
      connection.query(
        "SELECT * from history WHERE history_id = ?",
        id,
        (error, result) => {
          !error ? resolve(result) : reject(new Error(error));
        }
      );
    });
  },
  postHistory: (setData) => {
    return new Promise((resolve, reject) => {
      connection.query(
        "INSERT INTO history SET ?",
        setData,
        (error, result) => {
          !error ? resolve(result) : reject(new Error(error));
        }
      );
    });
  },
  patchHistory: (setData, id) => {
    return new Promise((resolve, reject) => {
      connection.query(
        "UPDATE history SET ? WHERE history_id = ?",
        [setData, id],
        (error, result) => {
          !error ? resolve(result) : reject(new Error(error));
        }
      );
    });
  },
};
