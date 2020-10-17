const connection = require("../config/mysql");

module.exports = {
  getAllHistory: (limit, offset, sort) => {
    return new Promise((resolve, reject) => {
      connection.query(
        `SELECT user.user_name, history.history_id, history.history_invoice, history.history_subtotal, history.history_created_at FROM history JOIN user ON history.user_id = user.user_id ORDER BY ${sort} LIMIT ? OFFSET ?`,
        [limit, offset],
        (error, result) => {
          !error ? resolve(result) : reject(new Error(error));
        }
      );
    });
  },
  getHistoryToday: () => {
    return new Promise((resolve, reject) => {
      connection.query(
        "SELECT user.user_name, history.history_id, history.history_invoice, history.history_subtotal, history.history_created_at FROM history JOIN user ON history.user_id = user.user_id WHERE DAY(history_created_at) = DAY(NOW()) AND MONTH(history_created_at) = MONTH(NOW()) AND YEAR(history_created_at) = YEAR(NOW())",
        (error, result) => {
          !error ? resolve(result) : reject(new Error(error));
        }
      );
    });
  },
  getHistoryMonth: () => {
    return new Promise((resolve, reject) => {
      connection.query(
        "SELECT user.user_name, history.history_id, history.history_invoice, history.history_subtotal, history.history_created_at FROM history JOIN user ON history.user_id = user.user_id WHERE MONTH(history_created_at) = MONTH(NOW()) AND YEAR(history_created_at) = YEAR(NOW())",
        (error, result) => {
          !error ? resolve(result) : reject(new Error(error));
        }
      );
    });
  },
  getHistoryWeek: () => {
    return new Promise((resolve, reject) => {
      connection.query(
        "SELECT user.user_name, history.history_id, history.history_invoice, history.history_subtotal, history.history_created_at FROM history JOIN user ON history.user_id = user.user_id WHERE WEEK(history_created_at) = WEEK(NOW()) AND YEAR(history_created_at) = YEAR(NOW())",
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
  getHistoryTodayIncome: () => {
    return new Promise((resolve, reject) => {
      connection.query(
        "SELECT SUM(history_subtotal) AS total_income, history_created_at FROM history WHERE YEAR(history_created_at) = YEAR(NOW()) AND MONTH(history_created_at) = MONTH(NOW()) AND DAY(history_created_at) = DAY(NOW()) GROUP BY DAY(NOW())",
        (error, result) => {
          !error ? resolve(result) : reject(new Error(error));
        }
      );
    });
  },
  getCountHistoryWeek: () => {
    return new Promise((resolve, reject) => {
      connection.query(
        `SELECT COUNT(*) AS orders FROM history WHERE WEEK(history_created_at) = WEEK(now()) GROUP BY WEEK(NOW())`,
        (error, result) => {
          !error ? resolve(result) : reject(new Error(error));
        }
      );
    });
  },
  getHistoryYearIncome: () => {
    return new Promise((resolve, reject) => {
      connection.query(
        "SELECT SUM(history_subtotal) AS yearsIncome FROM history WHERE YEAR(history_created_at) = YEAR(now()) GROUP BY YEAR(NOW())",
        (error, result) => {
          !error ? resolve(result) : reject(new Error(error));
        }
      );
    });
  },
  getHistoryChartThisMonth: () => {
    return new Promise((resolve, reject) => {
      connection.query(
        "SELECT DATE(history_created_at) AS date, SUM(history_subtotal) AS total FROM history WHERE MONTH(history_created_at) = MONTH(NOW()) AND YEAR(history_created_at) = YEAR(NOW()) GROUP BY DATE(history_created_at)",
        (error, result) => {
          !error ? resolve(result) : reject(new Error(error));
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
