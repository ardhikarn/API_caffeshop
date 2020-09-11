const router = require("express").Router();
const {
  getProduct,
  getProductByName,
  getProductById,
  postProduct,
  patchProduct,
  deleteProduct,
} = require("../controllers/control_product");
const { authorization, authorizationAdmin } = require("../middleware/auth");
const {
  getProductRedis,
  getProductByIdRedis,
  clearProductRedis,
} = require("../middleware/redis");
const uploadFilter = require("../middleware/multer");

router.get("/", authorization, getProductRedis, getProduct);
router.get("/search", authorization, getProductByName);
router.get("/:id", authorization, getProductByIdRedis, getProductById);

router.post(
  "/",
  authorizationAdmin,
  uploadFilter,
  clearProductRedis,
  postProduct
);

router.patch(
  "/:id",
  authorizationAdmin,
  uploadFilter,
  clearProductRedis,
  patchProduct
);

router.delete("/:id", authorizationAdmin, clearProductRedis, deleteProduct);

module.exports = router;
