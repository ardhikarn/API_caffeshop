const router = require("express").Router();
const { registerUser, loginUser } = require("../controllers/control_users");

router.post("/register", registerUser);
router.get("/login", loginUser);

module.exports = router;
