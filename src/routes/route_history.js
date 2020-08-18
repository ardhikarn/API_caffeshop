const router = require("express").Router();
const {
  getAllHistory,
  getHistoryById,
  // postHistory,
  // patchHistory,
} = require("../controllers/control_history");

router.get("/", getAllHistory);

router.get("/:id", getHistoryById);

// router.post("/", postHistory);

// router.patch("/:id", patchHistory);

module.exports = router;
