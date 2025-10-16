// A minimal Express API for the LLM Code Deployment project.
// See README.md for instructions on how to run, deploy, and test.

const express = require('express');
const { v4: uuidv4 } = require('uuid'); // Using uuid for a random commit SHA, though a simpler random string would also work.

const app = express();
app.use(express.json()); // Middleware to parse JSON bodies

// --- Configuration ---
// IMPORTANT: In a production environment, use environment variables for sensitive data.
// The secret key for validating requests.
// For local testing, we use a default temporary secret.
// For Vercel deployment, set this as an environment variable `SECRET_KEY`.
const SECRET_KEY = process.env.SECRET_KEY || 'a-temporary-secret-for-testing';

// The GitHub username to use in the response URLs.
// For Vercel deployment, set this as an environment variable `GITHUB_USERNAME`.
const GITHUB_USERNAME = process.env.GITHUB_USERNAME || 'YOUR_GITHUB_USERNAME';

// The port the server will listen on. Vercel sets this automatically.
const PORT = process.env.PORT || 3000;

// --- API Endpoint ---
app.post('/api/receive', (req, res) => {
  // 1. Validate the secret key from the request headers.
  const sentKey = req.header('X-Secret-Key');
  if (!sentKey || sentKey !== SECRET_KEY) {
    console.log('❌ Invalid or missing secret key.');
    return res.status(403).json({ error: 'Forbidden - Invalid secret key.' });
  }

  // 2. Read required fields from the JSON request body.
  const { email, task, round, nonce, brief } = req.body;

  // Basic validation to ensure required fields are present.
  if (!email || !task || !round || !nonce || !brief) {
    console.log('❌ Missing one or more required fields in request body.');
    return res.status(400).json({ error: 'Bad Request - Missing required fields.' });
  }

  // Log to the console that a task has been received.
  console.log(`✅ Task received for ${email}: ${brief}`);

  // 3. Prepare the JSON response.
  // Generate a random 7-character string for the commit SHA.
  const commit_sha = uuidv4().substring(0, 7);

  const responsePayload = {
    status: 'OK',
    email: email,
    task: task,
    round: round,
    nonce: nonce,
    repo_url: `https://github.com/${GITHUB_USERNAME}/${task}`,
    commit_sha: commit_sha,
    pages_url: `https://${GITHUB_USERNAME}.github.io/${task}/`
  };

  // 4. Send the successful response.
  res.status(200).json(responsePayload);
});

// --- Server Activation ---
app.listen(PORT, () => {
  console.log(`🚀 Server is running and listening on port ${PORT}`);
  console.log(`🔑 Using secret key: ${SECRET_KEY}`);
  console.log(`👤 Using GitHub username: ${GITHUB_USERNAME}`);
  console.log('Send a POST request to /api/receive to test the endpoint.');
});

// Export the app for Vercel's serverless environment
module.exports = app;