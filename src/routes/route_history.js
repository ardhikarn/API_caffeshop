const router = require("express").Router();
const {
  getAllHistory,
  getHistoryById,
  getHistoryToday,
  getHistoryMonth,
  getHistoryWeek,
  getHistoryTodayIncome,
  getCountHistoryWeek,
  getHistoryYearIncome,
  getHistoryChartThisMonth,
} = require("../controllers/control_history");

router.get("/", getAllHistory);
router.get("/id/:id", getHistoryById);
router.get("/today", getHistoryToday);
router.get("/month", getHistoryMonth);
router.get("/week", getHistoryWeek);
router.get("/todayincome", getHistoryTodayIncome);
router.get("/countWeek", getCountHistoryWeek);
router.get("/yearsIncome", getHistoryYearIncome);
router.get("/chartThisMonth", getHistoryChartThisMonth);

module.exports = router;
