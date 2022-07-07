// Importing dependencies

// We only need Schema constructor, model function and the type special property from mongoose library, so we are importing only three of them
const { Schema, model, Types } = require("mongoose");
// Importing moment
const moment = require("moment");

// Creating models for the thoughts collection
const UserReactionSchema = new Schema(
  {
    //  Schema definition for user's reaction id
    UserReactionId: {
      type: Schema.Types.ObjectId,
      default: () => new Types.ObjectId(),
    },

    //  Schema definition for user's reaction body
    UserReactionBody: {
      type: String,
      required: true,
      // The length of a user's reaction will be trimmed if it exceeds 300 characters.
      maxlength: 300,
    },

    //  Schema definition for user names
    username: {
      type: String,
      required: true,
    },

    //  Schema definition of a user's reaction creation time
    createdAt: {
      type: Date,
      default: Date.now,
      get: (createdAtVal) =>
        moment(createdAtVal).format("MMM DD, YYYY [at] hh:mm a"),
    },
  },

  {
    toJSON: {
      virtuals: true,
      getters: true,
    },
    id: false,
  }
);

//  Schema definition for thoughts
const UserThoughtScaema = new Schema(
  {
    userThoughtText: {
      type: String,
      required: true,
      // A minimum and maximum text length of 1 and 300 character are determined by the following two rules.
      minlenght: 1,
      maxlength: 300,
    },

    //  Schema definition of a thought's creation time
    createdAt: {
      type: Date,
      default: Date.now,
      get: (createdAtVal) =>
        moment(createdAtVal).format("MMM DD, YYYY [at] hh:mm a"),
    },

    //  Schema definition for user names
    username: {
      type: String,
      required: true,
    },

    userReactions: [UserReactionSchema],
  },

  {
    toJSON: {
      virtuals: true,
      getters: true,
    },
    id: false,
  }
);

UserThoughtScaema.virtual("userReactionCount").get(function () {
  return this.userReactions.length;
});

// The ThoughtSchema is used to create the Thought model
const UserThought = model("UserThought", UserThoughtScaema);

// export the UserThought model
module.exports = UserThought;
