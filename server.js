import express from "express";
import { getVersion } from "./utilities.js";
const app = express();
const port = 3000;

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
