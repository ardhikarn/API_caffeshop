const router = require("express").Router();
const {
  getAllOrder,
  getOrderById,
  postOrder,
} = require("../controllers/control_order");

router.get("/", getAllOrder);

router.get("/:id", getOrderById);

router.post("/", postOrder);

module.exports = router;
