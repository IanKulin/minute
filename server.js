import express from "express";
import path from "path";
import fs from "fs";
import { getVersion } from "./utilities.js";
import { fileURLToPath } from "url";

const app = express();
const port = 3001;

// define __dirname manually for ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

// Make a helper function available to EJS
app.locals.version = await getVersion();

app.get("/", (req, res) => {
  res.render("index.ejs", {
    title: "Index",
  });
});

app.get("/test/:testName", (req, res) => {
  const studentId = 1; // Example: Retrieved from session/auth
  const testName = req.params.testName;
  // Load the JSON file corresponding to the test name
  const testFilePath = path.join(__dirname, "data/tests", `${testName}.json`);
  fs.readFile(testFilePath, "utf8", (err, data) => {
    if (err) {
      // Handle error (e.g., file not found)
      return res.status(404).send("Test not found.");
    }
    const test = JSON.parse(data); // Parse the JSON file content
    // Render the EJS template and pass the studentId, testId, and test data
    res.render("test", {
      studentId: studentId,
      testId: testName,
      test: test,
    });
  });
});

app.post("/submit-test", (req, res) => {
  const studentId = req.body.studentId;
  const testId = req.body.testId;
  const studentAnswers = req.body.answers;
  // Load the test file to get the correct answers
  const testFilePath = path.join(__dirname, "data/tests", `${testId}.json`);
  fs.readFile(testFilePath, "utf8", (err, data) => {
    if (err) {
      return res.status(404).send("Test not found.");
    }
    const test = JSON.parse(data);
    let score = 0;
    const totalQuestions = test.questions.length;
    // Compare student answers with correct answers
    test.questions.forEach((question, index) => {
      const correctAnswer = question.answer;
      const studentAnswer = studentAnswers[index];
      console.log(`Question ${index + 1}: Correct answer: ${correctAnswer}, Student answer: ${studentAnswer}`);
      if (parseInt(studentAnswer) === correctAnswer) {
        score++;
      }
    });
    // Return the results to the student or store in the database
    res.send(`You scored ${score} out of ${totalQuestions}`);
  });
});

//404 handling
app.use(function (req, res, next) {
  const username = req.username;
  const role = req.role;
  res.status(404).render("404", { title: "404", url: req.url });
});

process.on("SIGINT", () => {
  console.log("Signal received, shutting down...");
  //dbClose();
  process.exit();
});

(async function startServer() {
  try {
    //dbInitialise();
    app.listen(port, () => {
      console.log(`Server is running at http://localhost:${port}`);
    });
  } catch (err) {
    console.error("Error starting server:", err);
  }
})();
