const router = require("express").Router();
const {
  getAllUser,
  getUserById,
  getUserByEmail,
  registerUser,
  loginUser,
  patchUser,
  sendEmailForgot,
  changePassword,
} = require("../controllers/control_users");
const { authorizationAdmin, authorization } = require("../middleware/auth");
const { getUserRedis } = require("../middleware/redis");

router.get("/", authorizationAdmin, getAllUser); //getUserRedis sementara dihapus
router.get("/id/:id", authorization, getUserById);
router.get("/search", authorization, getUserByEmail);
router.post("/register", registerUser);
router.post("/login", loginUser);
router.patch("/edit/:id", authorizationAdmin, patchUser);
router.post("/forgot-password", sendEmailForgot);
router.patch("/change-password", changePassword);

module.exports = router;
