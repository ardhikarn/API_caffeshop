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
  getProductByIdRedis,
  clearDataProductRedist,
} = require("../middleware/redis");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: (request, file, callback) => {
    callback(null, "./uploads/");
  },
  filename: (request, file, callback) => {
    callback(
      null,
      new Date().toISOString().replace(/:/g, "-") + "-" + file.originalname
    );
  },
});
const upload = multer({
  storage: storage,
  limits: { fileSize: 60000 },
  fileFilter: (req, file, callback) => {
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
      return callback(new Error("Only image files are allowed!"));
    }
    callback(null, true);
  },
});

router.get("/", authorization, getProduct);
router.get("/:id", authorization, getProductByIdRedis, getProductById);

router.post(
  "/",
  authorizationAdmin,
  upload.single("product_image"),
  postProduct
);

router.patch("/:id", authorizationAdmin, clearDataProductRedist, patchProduct);

router.delete(
  "/:id",
  authorizationAdmin,
  clearDataProductRedist,
  deleteProduct
);

module.exports = router;
