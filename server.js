const express = require("express");
const mongoose = require("mongoose");
const ejs = require("ejs");
const bodyParser = require("body-parser");

const app = express();
const port = 3000;

mongoose
  .connect("URL", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to database"))
  .catch((err) => console.error("Database connection error:", err));

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  res.render("index");
});

app.post("/submit", async (req, res) => {
  try {
    const { qualityOfEducation, teamworkSkills, leadershipSkills, comment } =
      req.body;

    if (
      !qualityOfEducation ||
      !teamworkSkills ||
      !leadershipSkills ||
      isNaN(qualityOfEducation) ||
      isNaN(teamworkSkills) ||
      isNaN(leadershipSkills) ||
      qualityOfEducation < 1 ||
      qualityOfEducation > 5 ||
      teamworkSkills < 1 ||
      teamworkSkills > 5 ||
      leadershipSkills < 1 ||
      leadershipSkills > 5 ||
      comment.length > 300
    ) {
      return res.status(400).send("Invalid data.");
    }

    const newSurvey = new Survey({
      qualityOfEducation,
      teamworkSkills,
      leadershipSkills,
      comment,
    });

    await newSurvey.save();
    res.send("Thank you for completing the survey!");
  } catch (error) {
    console.error("Data saving error:", error);
    res.status(500).send("Server error.");
  }
});

const Survey = mongoose.model(
  "Survey",
  new mongoose.Schema({
    qualityOfEducation: { type: Number, required: true, min: 1, max: 5 },
    teamworkSkills: { type: Number, required: true, min: 1, max: 5 },
    leadershipSkills: { type: Number, required: true, min: 1, max: 5 },
    comment: String,
  })
);

app.listen(port, () => {
  console.log(`Server started on http://localhost:${port}`);
});
