# CareerGen User-Service

The **user-service** is a core microservice within the CareerGen platform, responsible for user management, authentication, asset handling, and email integration. It is built with Node.js and designed for ease of deployment both locally and with Docker.

***

## Features

- **User management and authentication**
- **Secure API endpoints**
- **Email sending support**
- **AWS S3 integration for asset management**
- **Environment-driven configuration**

***

## Environment Variables (`local.env`)

Create a `local.env` file inside the `user-service` directory with the following content:

```env
PORT=2048

MONGO_URI=""

USER_HOST=""
AGENT_HOST=""

FRONTEND_HOST=""

MAIL=""
HOST=""
MAILPORT=000
SECURE=true
USER_NAME=""
PASSWORD=""

CRYPTO_SECRET=""

AWS_S3_REGION=""
AWS_S3_PUBLIC=""
AWS_S3_ACCESS=""
AWS_S3_SECRET=""

ASSET_URL=""

HMAC_AGENT_KEY=""
HMAC_USER_KEY=""

AUTH_PRIVATE_SIGNER=""
# The signer is a base64 encoded RSA Private Signer Key (Example: PrivateKey.pem).
# Also do not forget to replace the appropriate public key file in the private/ directory .
```

*Replace the values with those appropriate for your environment and secrets.*

***

## Running User-Service Locally (Without Docker)

1. **Clone the repository**

```bash
git clone https://github.com/captcha781/agentic-ai-career-path-generator.git
```

2. **Navigate to the user-service directory**

```bash
cd user-service
```

3. **Create and configure the environment file**

```bash
touch local.env
# Paste the above variable template and update with your own configuration.
```

4. **Ensure Node.js v22 is installed**
5. **Install dependencies**

```bash
npm i
```

6. **Start the service**

```bash
npm start
```


***

## Running User-Service Locally (With Docker)

1. **Clone the repository**

```bash
git clone https://github.com/captcha781/agentic-ai-career-path-generator.git
```

2. **Navigate to the user-service directory**

```bash
cd user-service
```

3. **Create and configure the environment file**

```bash
touch local.env
# Edit and fill local.env as per your setup.
```

4. **Build the Docker image**

```bash
docker build -t user-service .
```

5. **Start the Docker container**

```bash
docker run -p <hostport>:<containerport> user-service
```

Example: `-p 2048:2048`

***

## Project Structure

```
agentic-ai-career-path-generator/
│
└── user-service/
    ├── controllers/
    ├── config/
    ├── ... (project files)
    └── local.env
```


***

## Contributing

Feel free to fork the repository, submit issues, or open a pull request!

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

## Note - Defaults

A default entry should be made in the emailTemplate mongodb colletion to enable the email sending feature, kindly refer ```controllers/mail.js``` file for the identifier and placeholders.

Kindly configure your own email provider transport instead of ```nodemailer-brevo-transport```


***

Happy Building! 🚀
