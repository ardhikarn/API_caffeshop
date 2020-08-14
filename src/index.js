const route = require("express").Router();

// import route
const routeProduct = require("./routes/route_product");
const routeCategory = require("./routes/route_category");

// buat middle
route.use("/product", routeProduct);
route.use("/category", routeCategory);

module.exports = route;
