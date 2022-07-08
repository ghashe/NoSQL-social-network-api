// Importing dependencies
const router = require("express").Router();

// Importing api routes
const apiRoutes = require("./api");

// All API routes imported from the *api* directory should have a prefix of '/api'
router.use("/api", apiRoutes);

router.use((request, response) => {
  response.status(404).send("404 Error!");
});

module.exports = router;
