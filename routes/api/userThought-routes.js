// Importing dependencies
const router = require("express").Router();

const {
  getAllUserThought,
  getUserThoughtById,
  createUserThought,
  updateUserThought,
  deleteUseerThought,
  createUserReaction,
  deleteReaction,
} = require("../../controllers/userThought-controller");

// Configure GET all and POST to at /api/userThoughts
router.route("/").get(getAllUserThought).post(createUserThought);

// Configure GET, PUT and DELETE a userThought by id at /api/usersThoughts/:id
router
  .route("/:id")
  .get(getUserThoughtById)
  .put(updateUserThought)
  .delete(deleteUseerThought);

// Configure POST reaction by userThoughtId at /api/userThoughts/:userThoughtId/reactions
router.route("/:userThoughtId/reactions").post(createUserReaction);

// Configure DELETE reaction by reactionId at /api/userThoughts/:userThoughtId/reactions/:reactionId
router.route("/:userThoughtId/reactions/:reactionId").delete(deleteReaction);

module.exports = router;
