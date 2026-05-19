import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
import compression from "compression";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(compression());
  app.use(express.json());

  // API Route for Web3Forms
  app.post("/api/contact", async (req, res) => {
    const { name, contact, type, promo, message } = req.body;
    const accessKey = process.env.WEB3FORMS_ACCESS_KEY;
    const isDev = process.env.NODE_ENV !== "production";

    if (!accessKey) {
      if (isDev) {
        console.warn("WEB3FORMS_ACCESS_KEY is missing. In DEV mode, returning mock success.");
        return res.json({ success: true, warning: "Mock success (key missing)" });
      }
      console.error("Web3Forms Access Key missing");
      return res.status(500).json({ error: "Server configuration error" });
    }

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({
          access_key: accessKey,
          from_name: "Future Pages Vibe",
          subject: `New Request: ${type}`,
          name: name,
          contact_info: contact,
          request_type: type,
          promo_code: promo || 'None',
          message: message,
        })
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Failed to submit form');
      }

      res.json({ success: true });
    } catch (error) {
      console.error("Web3Forms API Error:", error);
      res.status(500).json({ error: "Failed to send message" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
