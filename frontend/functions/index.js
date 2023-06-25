const functions = require("firebase-functions");
const {spawn} = require("child-process-promise");

exports.flaskApp = functions.https.onRequest((req, res) => {
  const app = spawn("python", ["main.py"], {cwd: __dirname});

  app.stdout.on("data", (data) => {
    console.log(`stdout: ${data}`);
  });

  app.stderr.on("data", (data) => {
    console.error(`stderr: ${data}`);
  });

  res.send("Running Flask app...");
});
