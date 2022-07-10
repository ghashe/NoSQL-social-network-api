// Importing dependencies
const express = require("express");
const mongoose = require("mongoose");

const app = express();
// If a preconfigured port does not exist, use port 3001
const PORT = process.env.PORT || 3001;

// Parsing incoming JSON requests and adding the parsed data to request.body.
app.use(express.json());
// Parsing the incoming request with urlencoded payloads based on the body-parser
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.use(require("./routes"));

mongoose.connect(
  process.env.MONGODB_URI || "mongodb://localhost/NoSQL-social-network-api",
  {
    useFindAndModify: false,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

mongoose.set("debug", true);

app.listen(PORT, () => console.log(`App is now listining on PORT: ${PORT}`));
