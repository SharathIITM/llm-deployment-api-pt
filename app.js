const express = require('express');
const { v4: uuidv4 } = require('uuid');

const app = express();
app.use(express.json());

const SECRET_KEY = process.env.SECRET_KEY || 'iitsstd250llmdev';

const GITHUB_USERNAME = process.env.GITHUB_USERNAME || 'SharathIITM';

const PORT = process.env.PORT || 3000;

app.post('/api/receive', (req, res) => {
  const sentKey = req.header('X-Secret-Key');
  if (!sentKey || sentKey !== SECRET_KEY) {
    console.log('❌ Invalid or missing secret key.');
    return res.status(403).json({ error: 'Forbidden - Invalid secret key.' });
  }

  const { email, task, round, nonce, brief } = req.body;

  if (!email || !task || !round || !nonce || !brief) {
    console.log('❌ Missing one or more required fields in request body.');
    return res.status(400).json({ error: 'Bad Request - Missing required fields.' });
  }

  console.log(`✅ Task received for ${email}: ${brief}`);

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

  res.status(200).json(responsePayload);
});

app.listen(PORT, () => {
  console.log(`🚀 Server is running and listening on port ${PORT}`);
  console.log(`🔑 Using secret key: ${SECRET_KEY}`);
  console.log(`👤 Using GitHub username: ${GITHUB_USERNAME}`);
  console.log('Send a POST request to /api/receive to test the endpoint.');
});

module.exports = app;