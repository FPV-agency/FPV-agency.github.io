# FPV | the Future Pages Vibe

This is a full-stack web application built with React, Vite, Express, and Tailwind CSS.

## 🚀 Getting Started

### 1. Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher)
- npm

### 2. Installation
Clone the repository and install dependencies:
```bash
npm install
```

### 3. Environment Setup
Copy the `.env.example` file to `.env` and fill in your API keys:
```bash
cp .env.example .env
```
Key variables:
- `GEMINI_API_KEY`: Your Google Gemini API key.
- `WEB3FORMS_ACCESS_KEY`: Your key for the contact form.

### 4. Running the App

#### Development Mode
Runs the app with hot module replacement:
```bash
npm run dev
```

#### Production Mode
Builds the app and starts the production server:
```bash
npm run build
npm start
```

## 🌐 Deployment

This app is configured to run as a full-stack Node.js application. 

### Hosting Options:
- **Google Cloud Run**: Ideal for the current configuration.
- **Render / Railway / Fly.io**: Easy deployment for Node.js apps.
- **VPS (DigitalOcean/Linode)**: Run with PM2 or Docker.

### Building for Production
The `npm run build` command:
1. Builds the React frontend using Vite into the `dist` folder.
2. Bundles the Express server (`server.ts`) into a single file `dist/server.cjs` using esbuild.

To start the server, simply run `npm start`.

## 🛠 Tech Stack
- **Frontend**: React 19, Vite, Tailwind CSS, Lucide Icons, Framer Motion (motion).
- **Backend**: Express, tsx, esbuild.
- **AI**: Google Gemini API.
