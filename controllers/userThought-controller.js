// Importing User and UserThought models
const { User, UserThought } = require("../models");

const userthoughtController = {
  // The /api/users endpoint

  // GET all user thoughts (GET /api/thoughts)
  getAllUserThought(request, response) {
    // Find all UserThought objects in our UserThought model with the .find({}) method
    UserThought.find({})
      .populate({
        path: "userReactions",
        select: "-__v",
      })
      .select("-__v")
      .sort({ _id: -1 })
      .then((databaseUserData) => response.json(databaseUserData))
      // Catching error and sending status code 400 if the server is unable to process the request because of a client error
      .catch((err) => {
        console.log(err);
        response.sendStatus(400);
      });
  },

  // GET UserThought by id (GET /api/thoughts/id)
  getUserThoughtById({ params }, response) {
    UserThought.findOne({ _id: params.id })
      .populate({
        path: "userReactions",
        select: "-__v",
      })
      .select("-__v")
      .sort({ _id: -1 })
      .then((databaseUserData) => {
        if (!databaseUserData) {
          // Sending a status 404 message to the user if thought with the given id is not found
          response.status(404).jason({
            message: `Sorry, no thought with id ${params.id} has been found! Please check your input and try again!`,
          });
          return;
        }
        // If a thought with the given id is found, convert data to JSON format and send that thought
        response.json(databaseUserData);
      })
      // Catching error and ending status code 400 if the server is unable to process the request because of a client error.
      .catch((err) => {
        console.log(err);
        response.sendStatus(400);
      });
  },

  // Create new thought (POST /api/thoughts)
  createUserThought({ body }, response) {
    UserThought.create(body)
      .then(({ _id }) => {
        return User.findOneAndUpdate(
          { _id: body.userId },
          { $push: { thoughts: _id } },
          { new: true }
        );
      })
      .then((databaseUserData) => {
        if (!databaseUserData) {
          // Sending a status 404 message to the user if user with the given id is not found
          response.status(404).jason({
            message: `Sorry, no user with id ${_id} has been found! Please check your input and try again!`,
          });
          return;
        }

        // If a user with the given id is found, convert data to JSON format and send that user to the client
        response.json(databaseUserData);
      })
      // Sending error if any to the user if the server encountered an unexpected condition that prevented it from fulfilling the request.
      .catch((err) => {
        console.log(err);
        response.json(err);
      });
  },

  // Update a thought (PUT /api/thoughts/id)
  updateUserThought({ params, body }, response) {
    UserThought.findOneAndUpdate({ _id: params.id }, body, {
      new: true,
      runValidators: true,
    })
      .then((databaseUserData) => {
        if (!databaseUserData) {
          // Sending a status 404 message to the user if thought with the given id is not found
          response.status(404).jason({
            message: `Sorry, no thought with id ${params.id} has been found! Please check your input and try again!`,
          });
          return;
        }

        // If a thought with the given id is found, convert data to JSON format and send that thought to the client
        response.json(databaseUserData);
      })
      // Sending error if any to the user if the server encountered an unexpected condition that prevented it from fulfilling the request.
      .catch((err) => {
        console.log(err);
        response.json(err);
      });
  },

  // Delete thought by id (DELETE /api/thoughts/id)
  deleteUseerThought({ params }, response) {
    UserThought.findOneAndDelete({ _id: params.id })
      .then((databaseUserData) => {
        if (!databaseUserData) {
          // Sending a status 404 message to the user if thought with the given id is not found
          response.status(404).jason({
            message: `Sorry, no thought with id ${params.id} has been found! Please check your input and try again!`,
          });
          return;
        }
        return User.findOneAndUpdate(
          { _id: params.userId },
          { $pull: { userThoughts: params.Id } },
          { new: true }
        );
      })
      .then((databaseUserData) => {
        if (!databaseUserData) {
          // Sending a status 404 message to the user if user with the given id is not found
          response.status(404).jason({
            message: `Sorry, no user with id ${params.Id} has been found! Please check your input and try again!`,
          });
          return;
        }
        response.json(databaseUserData);
      })
      // Sending error if any to the user if the server encountered an unexpected condition that prevented it from fulfilling the request.
      .catch((err) => response.json(err));
  },

  // ADD reaction
  createUserReaction({ params, body }, response) {
    UserThought.finfOneAndUpdate(
      { _is: params.UserThoughtId },
      { $push: { userReaction: body } },
      { new: true, runValidators: true }
    )
      .populate({ path: "userReactions", select: "-__v" })
      .select("-__v")
      .then((databaseUserData) => {
        if (!databaseUserData) {
          // Sending a status 404 message to the user if user with the given id is not found
          response.status(404).jason({
            message: `Sorry, no though with id ${params.UserThoughtId} has been found! Please check your input and try again!`,
          });
          return;
        }
        response.json(databaseUserData);
      })
      // Sending error if any to the user if the server encountered an unexpected condition that prevented it from fulfilling the request.
      .catch((err) => response.json(err));
  },
  deleteUserReaction({ params }, response) {
    UserThought.findOneAndUpdate(
      { _id: params.userThoughtId },
      { $pull: { userReactions: { userReactionId: params.userReactionId } } },
      { new: true }
    )
      .then((databaseUserData) => {
        if (!databaseUserData) {
          // Sending a status 404 message to the user if thought with the given id is not found
          response.status(404).jason({
            message: `Sorry, no though with id ${params.UserThoughtId} has been found! Please check your input and try again!`,
          });
          return;
        }
        res.json(databaseUserData);
      })
      .catch((err) => res.json(err));
  },
};

module.exports = userthoughtController;
