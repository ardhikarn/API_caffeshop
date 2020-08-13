const router = require("express").Router();
const {
  getAllProduct,
  getProductByName,
} = require("../controllers/control_product");

router.get("/", getAllProduct);

router.get("/:name", getProductByName);

module.exports = router;
