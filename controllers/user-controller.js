// Importing User and UserThought models
const { User, UserThought } = require("../models");

const userController = {
  // The /api/users endpoint

  // GET all users (GET /api/users)
  getAllUsers(request, response) {
    // Find all User objects in our User model with the .find({}) method
    User.find({})
      .select("-__v")
      .sort({ _id: -1 })
      .then((databaseUserData) => response.json(databaseUserData))
      // Catching error and sending status code 400 if the server is unable to process the request because of a client error
      .catch((err) => {
        console.log(err);
        response.sendStatus(400);
      });
  },

  // GET user by id (GET /api/users/id)
  getUserById({ params }, response) {
    User.findOne({ _id: params.id })
      .populate({
        path: "thoughts",
        select: "-__v",
      })
      .populate({
        path: "friends",
        select: "-__v",
      })
      .then((databaseUserData) => {
        if (!databaseUserData) {
          // Sending a status 404 message to the user if user with the given id is not found
          response.status(404).json({
            message: `Sorry, no user with id ${params.id} has been found! Please check your input and try again!`,
          });
          return;
        }

        // If a user with the given id is found, convert data to JSON format and send that user
        response.json(databaseUserData);
      })
      // Catching error and ending status code 400 if the server is unable to process the request because of a client error.
      .catch((err) => {
        console.log(err);
        response.sendStatus(400);
      });
  },

  // Create new user (POST /api/users)
  createUser({ body }, response) {
    User.create(body)
      .then((databaseUserData) =>
        // Once a user has been successfully created, convert the data to JSON format and send it to the client
        response.json(databaseUserData)
      )
      // The server will send an error message to the user if it is unable to process the request for any reason.
      .catch((err) => response.jason(err));
  },

  // Update a user (PUT /api/users/id)
  updateUser({ params, body }, response) {
    User.findOneAndUpdate({ _id: params.id }, body, {
      new: true,
      runValidators: true,
    })
      .then((databaseUserData) => {
        if (!databaseUserData) {
          // Sending a status 404 message to the user if user with the given id is not found
          response.status(404).jason({
            message: `Sorry, no user with id ${params.id} has been found! Please check your input and try again!`,
          });
          return;
        }

        // If a user with the given id is found and updated, convert data to JSON format and send that user to the client
        response.json(databaseUserData);
      })
      // Sending error if any to the user if the server encountered an unexpected condition that prevented it from fulfilling the request.
      .catch((err) => {
        console.log(err);
        response.json(err);
      });
  },

  // Delete a user (DELETE /api/users/id)
  deleteUser({ params }, response) {
    User.findOneAndDelete({ _id: params.id })
      .then((databaseUserData) => {
        if (!databaseUserData) {
          response.status(404).json({
            message: `Sorry, no user with id ${params.id} has been found! Please check your input and try again!`,
          });
          return;
        }
        return databaseUserData;
      })
      .then((databaseUserData) => {
        User.updateMany(
          {
            _id: { $in: databaseUserData.friends },
          },
          {
            $pull: {
              friends: params.userId,
            },
          }
        )
          .then(() => {
            //deletes user's thought associated with id
            UserThought.deleteMany({
              username: databaseUserData.username,
            })
              .then(() => {
                response.json({
                  message: `User with id ${params.id} has been deleted successfully`,
                });
              })
              .catch((err) => {
                console.log(err);
              });
          })
          .catch((err) => {
            console.log(err);
          });
      })
      .catch((err) => {
        console.log(err);
      });
  },

  // ADD friend (/api/users/:userid/fiends/:friendId)
  addFriend({ params }, response) {
    User.findOneAndUpdate(
      { _id: params.userId },
      { $push: { friends: params.friendId } },
      { new: true }
    )
      .then((databaseUserData) => {
        if (!databaseUserData) {
          // Sending a status 404 message to the user if user with the given id is not found
          response.status(404).jason({
            message: `Sorry, no user with id ${params.friendId} has been found! Please check your input and try again!`,
          });
          return;
        }
        // If a user with the given id is found and added, convert data to JSON format and send that user to the client
        response.json(databaseUserData);
      })
      // Catching error and ending status code 400 if the server is unable to process the request because of a client error.
      .catch((err) => {
        console.log(err);
        response.status(400).json(err);
      });
  },

  // DELETE friend (/api/users/:userid/friends/:friendId)
  deleteFriend({ params }, response) {
    User.findOneAndUpdate(
      { _id: params.userId },
      { $pull: { friends: params.friendId } },
      { new: true }
    )
      .then((databaseUserData) => {
        if (!databaseUserData) {
          // Sending a status 404 message to the user if user with the given id is not found
          response.status(404).jason({
            message: `Sorry, no user with id ${params.userId} has been found! Please check your input and try again!`,
          });
          return;
        }
        // If a user with the given id is found and deleted, convert data to JSON format and send that user to the client
        response.json(databaseUserData);
      })
      // Catching error and ending status code 400 if the server is unable to process the request because of a client error.
      .catch((err) => {
        console.log(err);
        response.status(400).json(err);
      });
  },
};

module.exports = userController;
