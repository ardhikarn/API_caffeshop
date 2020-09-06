const router = require("express").Router();
const {
  getAllCategory,
  getCategoryById,
  postCategory,
  patchCategory,
  deleteCategory,
} = require("../controllers/control_category");
const { authorization, authorizationAdmin } = require("../middleware/auth");
const {
  getCategoryIdRedis,
  getCategoryRedis,
  clearCategoryRedis,
} = require("../middleware/redis");

router.get("/", authorization, getCategoryRedis, getAllCategory);
router.get("/:id", authorization, getCategoryIdRedis, getCategoryById);

router.post("/", authorizationAdmin, clearCategoryRedis, postCategory);
router.patch("/:id", authorizationAdmin, clearCategoryRedis, patchCategory);
router.delete("/:id", authorizationAdmin, clearCategoryRedis, deleteCategory);

module.exports = router;
