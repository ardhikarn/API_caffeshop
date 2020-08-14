const router = require("express").Router();
const { getAllOrder } = require("../controllers/control.order");

router.get("/", getAllOrder);
