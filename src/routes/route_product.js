const router = require("express").Router();
const {
  getProduct,
  getProductById,
  postProduct,
  patchProduct,
  deleteProduct,
} = require("../controllers/control_product");
const { authorization, authorizationAdmin } = require("../middleware/auth");
const {
  getProductRedis,
  getProductByIdRedis,
  clearDataRedist,
} = require("../middleware/redis");
const upload = require("../middleware/multer");

router.get("/", authorization, getProductRedis, getProduct);
router.get("/:id", authorization, getProductByIdRedis, getProductById);

router.post(
  "/",
  authorizationAdmin,
  upload.single("product_image"),
  postProduct
);

router.patch(
  "/:id",
  authorizationAdmin,
  upload.single("product_image"),
  clearDataRedist,
  patchProduct
);

router.delete("/:id", authorizationAdmin, clearDataRedist, deleteProduct);

module.exports = router;
