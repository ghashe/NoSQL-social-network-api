// Importing dependencies

// We only need Schema constructor and model function from mongoose library, so we are importing only two of them
const { Schema, model } = require("mongoose");
// Importing moment
const moment = require("moment");

// Creating models for the user collection
const UserSchema = new Schema(
  {
    //  Schema definition for user names
    username: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },

    //  Schema definition for email address
    email: {
      type: String,
      required: true,
      unique: true,
      // Filtering and passing only the email inputs that match the following regex condition to the next pipeline stage.
      match: [/.+@.+\..+/],
    },

    //  Schema definition for thoughts
    thoughts: [
      {
        type: Schema.Types.ObjectId,
        ref: "Thought",
      },
    ],

    //  Schema definition for friends
    friends: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    toJSON: {
      virtuals: true,
    },
    id: false,
  }
);

UserSchema.virtual("friendCount").get(function () {
  return this.friends.length;
});

// Using the UserSchema, create the User model
const User = model("User", UserSchema);

module.exports = User;
