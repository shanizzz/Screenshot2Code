# Screenshot → Code

Convert UI screenshots to HTML + Tailwind CSS using AI. Upload an image, get production-ready code.

![Screenshot to Code](https://img.shields.io/badge/AI-Powered-6366f1?style=flat-square)
![React](https://img.shields.io/badge/React-18-61dafb?style=flat-square)
![Node](https://img.shields.io/badge/Node-Express-22c55e?style=flat-square)

## Quick Start

### 1. Get a FREE Gemini API Key

- Go to [aistudio.google.com](https://aistudio.google.com)
- Sign in with your Google account
- Click **Get API Key** → **Create API Key**
- Copy the key

### 2. Setup Backend

```bash
cd server
npm install
cp .env.example .env
# Edit .env and add your GEMINI_API_KEY
npm run dev
```

### 3. Setup Frontend

```bash
cd client
npm install
npm run dev
```

### 4. Open

Visit [http://localhost:3000](http://localhost:3000), upload a screenshot, and click **Generate Code**.

## Tech Stack

- **Frontend:** React, Vite
- **Backend:** Node.js, Express
- **AI:** Google Gemini 1.5 Flash (free tier)

## Project Structure

```
screenshot-to-code/
├── client/          # React frontend
│   ├── src/
│   └── ...
├── server/          # Express API
│   ├── index.js
│   └── .env
└── README.md
```

## Environment Variables

| Variable        | Description                           |
|----------------|---------------------------------------|
| `GEMINI_API_KEY` | Your Google AI Studio API key (free) |
| `PORT`         | Server port (default: 5000)            |

## License

MIT
