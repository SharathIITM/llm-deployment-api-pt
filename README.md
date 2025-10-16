# LLM Code Deployment Project - Minimal API

This repository contains a minimal Node.js Express API built to satisfy the requirements of the LLM Code Deployment project.

The API has a single endpoint, `/api/receive`, that accepts a JSON POST request, validates a secret key, and returns a structured JSON response.

## Project Files

-   `app.js`: The main Express application file. It defines the API logic, handles requests, and sends responses.
-   `package.json`: Defines the project's metadata, dependencies (`express`, `uuid`), and a `start` script.
-   `Procfile`: Specifies the command for Vercel to run the application (`web: node app.js`).
-   `README.md`: This file, providing setup and deployment instructions.

---

## Step 1: Running the API Locally

Follow these steps to run the API on your local machine for testing.

### Prerequisites

-   [Node.js](https://nodejs.org/) (v18.x or later)
-   `npm` (comes with Node.js)

### Instructions

1.  **Clone the Repository:**
    If you haven't already, clone this repository to your local machine.

2.  **Install Dependencies:**
    Open your terminal, navigate to the project directory, and run:
    ```bash
    npm install
    ```

3.  **Run the Application:**
    Start the server using the `start` script defined in `package.json`:
    ```bash
    npm start
    ```

    You should see the following output, confirming the server is running:
    ```
    🚀 Server is running and listening on port 3000
    🔑 Using secret key: a-temporary-secret-for-testing
    👤 Using GitHub username: YOUR_GITHUB_USERNAME
    Send a POST request to /api/receive to test the endpoint.
    ```

    The API is now running at `http://localhost:3000`.

---

## Step 2: Initialize Git & Push to GitHub

To deploy the API to Vercel, you first need to host the code on GitHub.

### Instructions

1.  **Initialize a Git Repository:**
    If you haven't already, initialize a new Git repository in the project folder.
    ```bash
    git init -b main
    git add .
    git commit -m "Initial commit: Add API files"
    ```

2.  **Create a GitHub Repository:**
    -   Go to [GitHub](https://github.com/new) and create a new public repository.
    -   Name it after the task (e.g., `llm-code-deployment`).

3.  **Push Your Code to GitHub:**
    -   Follow the instructions on GitHub to link your local repository to the remote one and push your code. Replace `<YOUR_USERNAME>` and `<YOUR_REPO_NAME>` with your details.
    ```bash
    git remote add origin https://github.com/<YOUR_USERNAME>/<YOUR_REPO_NAME>.git
    git push -u origin main
    ```

---

## Step 3: Deploying the API to Vercel

Vercel provides a simple, free way to deploy Node.js applications.

### Instructions

1.  **Sign Up/Log In to Vercel:**
    -   Go to [Vercel](https://vercel.com/) and sign up for a free account using your GitHub profile.

2.  **Import Your GitHub Repository:**
    -   From your Vercel dashboard, click **"Add New..."** -> **"Project"**.
    -   Select the GitHub repository you just created. Vercel will automatically detect that it's a Node.js project.

3.  **Configure Environment Variables:**
    -   Before deploying, expand the **"Environment Variables"** section. This is crucial for security and proper functionality.
    -   Add the following two variables:
        -   **`SECRET_KEY`**: Set this to a secure, secret string of your choice. This is the key you will use to authenticate with your API.
        -   **`GITHUB_USERNAME`**: Set this to your GitHub username. This is used to construct the URLs in the API response.

4.  **Deploy:**
    -   Click the **"Deploy"** button. Vercel will build and deploy your application.
    -   Once complete, Vercel will provide you with a public URL for your API (e.g., `https://<project-name>.vercel.app`).

---

## Step 4: Testing the Deployed API

You can test your live API using `curl` or a tool like Postman.

### Using `curl`

Open your terminal and run the following command. Make sure to replace:
-   `<YOUR_VERCEL_URL>` with the URL Vercel provided.
-   `<YOUR_SECRET_KEY>` with the secret key you set as an environment variable in Vercel.

```bash
curl -X POST <YOUR_VERCEL_URL>/api/receive \
-H "Content-Type: application/json" \
-H "X-Secret-Key: <YOUR_SECRET_KEY>" \
-d '{
    "email": "test@example.com",
    "task": "llm-code-deployment",
    "round": 1,
    "nonce": "some-random-string",
    "brief": "A test submission from curl"
}'
```

### Expected Success Response (HTTP 200)

If the secret key is correct, you will receive a response like this:

```json
{
  "status": "OK",
  "email": "test@example.com",
  "task": "llm-code-deployment",
  "round": 1,
  "nonce": "some-random-string",
  "repo_url": "https://github.com/YOUR_GITHUB_USERNAME/llm-code-deployment",
  "commit_sha": "a1b2c3d",
  "pages_url": "https://YOUR_GITHUB_USERNAME.github.io/llm-code-deployment/"
}
```

### Expected Error Response (HTTP 403)

If the secret key is incorrect or missing, you will receive:

```json
{
  "error": "Forbidden - Invalid secret key."
}
```

---
