// Importing dependencies
const router = require("express").Router();

// Importing routes
const userRoutes = require("./user-routes");
const userThoughtRoutes = require("./userThought-routes");

router.use("/users", userRoutes);
router.use("/userThoughts", userThoughtRoutes);

module.exports = router;
