// Importing dependencies
const router = require("express").Router();

const {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  addFriend,
  deleteFriend,
  deleteUseer,
} = require("../../controllers/user-controller");

// Configure GET all and POST to at /api/users
router.route("/").get(getAllUsers).post(createUser);

// Configure GET, PUT and DELETE a user by id at /api/users/:id
router.route("/:id").get(getUserById).put(updateUser).delete(deleteUseer);

// Configure POST and DELETE a friend by friendId at /:userId/friends/:friendId
router.route("/:userId/friends/:friendId").post(addFriend).delete(deleteFriend);

module.exports = router;
