const router = require("express").Router();
const {
  getAllCategory,
  getCategoryById,
  postCategory,
  patchCategory,
  deleteCategory,
} = require("../controllers/control_category");

router.get("/", getAllCategory);
router.get("/:id", getCategoryById);
router.post("/", postCategory);
router.patch("/:id", patchCategory);
router.delete("/:id", deleteCategory);

module.exports = router;
