const express = require("express");
const { exec } = require("child_process");
const path = require("path");
const fs = require("fs");

const app = express();

app.use(express.static(path.join(__dirname, "public")));
app.use(express.json()); // Middleware to parse JSON data

// Function to get the latest folder in a directory
function getLatestFolder(directoryPath) {
  const folders = fs
    .readdirSync(directoryPath, { withFileTypes: true })
    .filter(
      (dirent) => dirent.isDirectory() && dirent.name.startsWith("result")
    )
    .map((dirent) => dirent.name);

  // Sort folders by date (assumes folder names have a timestamp or incremental values)
  folders.sort(
    (a, b) =>
      fs.statSync(path.join(directoryPath, b)).mtime.getTime() -
      fs.statSync(path.join(directoryPath, a)).mtime.getTime()
  );
  console.log(folders[0]);
  return folders[0]; // Return the latest folder
}

// Execute detection command
app.post("/executeCommand", (req, res) => {
  const { command } = req.body;
  if (!command) {
    return res.status(400).send("No command provided");
  }

  exec(command, (error, stdout, stderr) => {
    if (!error) {
      const latestFolder = getLatestFolder(
        "C:/Users/Billy/OneDrive/Desktop/ANPR/public/predict"
      );
      res.status(200).send(latestFolder); // Send the latest folder name as the response
    } else {
      res.status(500).send("Error during execution");
    }
  });
});

// Route to get the latest folder name
app.get("/getLatestFolder", (req, res) => {
  const latestFolder = getLatestFolder(
    "C:/Users/Billy/OneDrive/Desktop/ANPR/public/predict"
  );
  res.status(200).send(latestFolder);
});

const PORT = 3000; // Replace with your desired port number
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
