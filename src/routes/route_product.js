const router = require("express").Router();
const {
  getAllProduct,
  getProductByName,
  postProduct,
  patchProduct,
  deleteProduct,
} = require("../controllers/control_product");

router.get("/", getAllProduct);

router.get("/:name", getProductByName);

router.post("/", postProduct);

router.patch("/:id", patchProduct);

router.delete("/:id", deleteProduct);

module.exports = router;
