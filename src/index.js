const route = require("express").Router();

// import route
const routeCategory = require("./routes/route_category");
const routeProduct = require("./routes/route_product");
const routeHistory = require("./routes/route_history");
const routeOrder = require("./routes/route_order");
const routeUsers = require("./routes/route_users");
// const routePayment = require("./routes/route_payment");

// buat middle
route.use("/category", routeCategory);
route.use("/product", routeProduct);
route.use("/history", routeHistory);
route.use("/order", routeOrder);
route.use("/users", routeUsers);
// route.use("/payment", routePayment);

module.exports = route;
