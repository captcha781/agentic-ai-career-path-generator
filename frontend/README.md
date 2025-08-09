# CareerGen Frontend

The **frontend** is the user-facing web application of the CareerGen platform. It provides an intuitive, responsive interface for users to explore AI-powered career insights and manage their profiles. This app is built with modern web technologies and is designed for seamless integration with the CareerGen backend services.

***

## Features

- Clean, interactive UI for career path exploration
- Seamless API integration with CareerGen services
- Configurable via environment variables (`local.env`)
- Local development with fast refresh and debugging support

***

## Environment Variables (`local.env`)

Create a file named `local.env` in the `frontend` directory with the following contents:

```env
VITE_APP_BASE_NAME="/"
VITE_MODE="LOCAL"
VITE_USER_URL=""
VITE_AGENT_URL=""
```

> **Note:**
> Set `VITE_USER_URL` and `VITE_AGENT_URL` to the URLs of your respective backend services.

***

## Running the Frontend Locally (Without Docker)

1. **Clone the repository**

```bash
git clone https://github.com/captcha781/agentic-ai-career-path-generator.git
```

2. **Navigate to the frontend directory**

```bash
cd frontend
```

3. **Create and configure the environment file**

```bash
touch local.env
# Paste the env template above and set your values.
```

4. **Ensure Node.js v22 is installed**
5. **Install dependencies**

```bash
npm i
```

6. **Start the development server**

```bash
npm run dev
```

7. The app should now be accessible, typically at [http://localhost:5173](http://localhost:5173) unless otherwise specified in your output.

***

## Project Structure

```
agentic-ai-career-path-generator/
│
└── frontend/
    ├── src/
    ├── public/
    ├── ... (other frontend files)
    └── local.env
```


***

## Contributing

- Pull requests and feature suggestions are welcome!
- Fork the repository and open a PR.

***

## License

[MIT License](LICENSE)
© 2024 CareerGen

***

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.


## Contact

For help or questions:
**GitHub:** [captcha781/agentic-ai-career-path-generator](https://github.com/captcha781/agentic-ai-career-path-generator)
**Maintainer:** captcha781

***

Happy Exploring! 🚀

<div style="text-align: center">⁂</div>

[^1]: https://github.com/captcha781/agentic-ai-career-path-generator.git


