const router = require("express").Router();
const {
  getAllUser,
  registerUser,
  loginUser,
  patchUser,
} = require("../controllers/control_users");
const { authorizationAdmin } = require("../middleware/auth");
const { getUserRedis } = require("../middleware/redis");

router.get("/", authorizationAdmin, getUserRedis, getAllUser);
router.post("/register", registerUser);
router.post("/login", loginUser);
router.patch("/edit/:id", authorizationAdmin, patchUser);

module.exports = router;
