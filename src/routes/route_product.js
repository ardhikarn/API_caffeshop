const router = require("express").Router();
const {
  getProduct,
  getProductById,
  getProductByName,
  postProduct,
  patchProduct,
  deleteProduct,
} = require("../controllers/control_product");

router.get("/", getProduct);

router.get("/id/:id", getProductById);

router.get("/name/:name", getProductByName);

router.post("/", postProduct);

router.patch("/:id", patchProduct);

router.delete("/:id", deleteProduct);

module.exports = router;
