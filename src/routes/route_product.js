const router = require("express").Router();
const {
  getAllProduct,
  getProductById,
  getProductByName,
  postProduct,
  patchProduct,
  deleteProduct,
} = require("../controllers/control_product");

router.get("/", getAllProduct);

router.get("/:id", getProductById);

// router.get("/:name", getProductByName);

router.post("/", postProduct);

router.patch("/:id", patchProduct);

router.delete("/:id", deleteProduct);

module.exports = router;
