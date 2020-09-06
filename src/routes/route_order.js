const router = require("express").Router();
const {
  getAllOrder,
  getOrderById,
  postOrder,
} = require("../controllers/control_order");
const {
  getOrderRedis,
  getOrderIdRedis,
  clearOrderRedis,
  clearHistoryRedis,
} = require("../middleware/redis");
const { authorization, authorizationAdmin } = require("../middleware/auth");

router.get("/", authorizationAdmin, getOrderRedis, getAllOrder);

router.get("/:id", authorizationAdmin, getOrderIdRedis, getOrderById);

router.post("/", authorization, clearOrderRedis, clearHistoryRedis, postOrder);

module.exports = router;
