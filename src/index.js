const route = require("express").Router();

// import route
const routeProduct = require("./routes/route_product");
const routeCategory = require("./routes/route_category");
const routeHistory = require("./routes/route_history");
const routeOrder = require("./routes/route.order");

// buat middle
route.use("/product", routeProduct);
route.use("/category", routeCategory);
route.use("/history", routeHistory);
// route.use("/order", routeOrder);

module.exports = route;
