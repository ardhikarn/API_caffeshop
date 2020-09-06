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
const { authorizationAdmin } = require("../middleware/auth");
const {
  getHistoryRedis,
  getHistoryIdRedis,
  getHistoryTodayRedis,
  getHistoryWeekRedis,
  getHistoryMonthRedis,
  getHistoryTodayIncomeRedis,
  getHistoryCountWeekRedis,
  getHistoryYearIncomeRedis,
  getHistoryChartMonth,
} = require("../middleware/redis");

router.get("/", authorizationAdmin, getHistoryRedis, getAllHistory);
router.get("/id/:id", authorizationAdmin, getHistoryIdRedis, getHistoryById);
router.get("/today", authorizationAdmin, getHistoryTodayRedis, getHistoryToday);
router.get("/week", authorizationAdmin, getHistoryWeekRedis, getHistoryWeek);
router.get("/month", authorizationAdmin, getHistoryMonthRedis, getHistoryMonth);
router.get(
  "/todayincome",
  authorizationAdmin,
  getHistoryTodayIncomeRedis,
  getHistoryTodayIncome
);
router.get(
  "/countWeek",
  authorizationAdmin,
  getHistoryCountWeekRedis,
  getCountHistoryWeek
);
router.get(
  "/yearsIncome",
  authorizationAdmin,
  getHistoryYearIncomeRedis,
  getHistoryYearIncome
);
router.get(
  "/chartThisMonth",
  authorizationAdmin,
  getHistoryChartMonth,
  getHistoryChartThisMonth
);

module.exports = router;
