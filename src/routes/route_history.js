const router = require("express").Router();
const {
  getAllHistory,
  getHistoryById,
  getHistoryToday,
  getHistoryMonth,
  getHistoryWeek,
  getHistoryTotalIncome,
} = require("../controllers/control_history");

router.get("/", getAllHistory);
router.get("/id/:id", getHistoryById);
router.get("/today", getHistoryToday);
router.get("/month", getHistoryMonth);
router.get("/week", getHistoryWeek);
router.get("/totalincome", getHistoryTotalIncome);

module.exports = router;
