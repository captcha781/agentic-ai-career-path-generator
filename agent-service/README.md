# CareerGen

CareerGen is an AI-powered career path generator designed to help individuals discover personalized career trajectories using advanced agentic AI. By leveraging machine learning and modern database technologies, CareerGen provides tailor-made insights for users seeking their ideal career direction.

***

## Features

- **AI-Driven Recommendations:** Get smart, personalized career paths based on your profile.
- **Secure \& Scalable:** Built with modern security best practices and scalable cloud data solutions.
- **API-First:** Easily integrate with other user or front-end services.

***

## Prerequisites

- Python 3.12
- [Poetry](https://python-poetry.org/) for dependency management
- Docker (optional, for containerized runs)
- A configured `local.env` file (see below)

***

## Environment Variables (`local.env`)

Create a file named `local.env` in the `agent-service` directory with the following format:

```env
CORS_ORIGIN=""
MONGO_URI=""
API_HOST=""
USER_HOST=""
FRONT_HOST=""

PORT=5000

GEMINI_API_KEY=""

HMAC_AGENT_KEY=""
HMAC_USER_KEY=""

# Not required but kept for future use
ASTRA_DB_SECRET_KEY=""
ASTRA_DB_ENDPOINT=""
ASTRA_DB_KEYSPACE=""

```

Fill in these variables as per your environment setup.

***

## Running CareerGen Locally (Without Docker)

1. **Clone the repository:**

```bash
git clone https://github.com/captcha781/agentic-ai-career-path-generator.git
```

2. **Navigate to the service directory:**

```bash
cd agent-service
```

3. **Create and set up the environment file:**

```bash
touch local.env
# Paste the above env config into local.env and fill in your values
```

4. **Ensure Python 3.12 is installed.**
5. **Set up a virtual environment:**

```bash
virtualenv venv
source venv/bin/activate     # Linux
venv\Scripts\activate        # Windows
```

6. **Install Poetry:**

```bash
pip install poetry
```

7. **Install project dependencies:**

```bash
poetry install
```

8. **Run the server:**

```bash
poetry run server
```


***

## Running CareerGen Locally (With Docker)

1. **Clone the repository:**

```bash
git clone https://github.com/captcha781/agentic-ai-career-path-generator.git
```

2. **Navigate to the service directory:**

```bash
cd agent-service
```

3. **Create and set up the environment file:**

```bash
touch local.env
# Paste the above env config into local.env and fill in your values
```

4. **Build the Docker image:**

```bash
docker build -t agent-service .
```

5. **Run the Docker container:**

```bash
docker run -p <hostport>:<containerport> agent-service
```

Replace `<hostport>` and `<containerport>` with your desired port numbers (e.g. `-p 5000:5000`).

***

## Project Structure

```
agentic-ai-career-path-generator/
│
└── agent-service/
    ├── backend/
    ├── ... (other project files)
    └── local.env
```


***

## Contribution

Contributions, issues and feature requests are welcome! Fork the repository and open a pull request.

***

## License

[MIT License](LICENSE)
© 2024 CareerGen

***

## Contact

For support or inquiries:
**GitHub:** [captcha781/agentic-ai-career-path-generator](https://github.com/captcha781/agentic-ai-career-path-generator)
**Maintainer:** captcha781

***

Happy Career Planning! 🚀
