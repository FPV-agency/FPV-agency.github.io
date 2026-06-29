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

  // API Route for Google Apps Script Web App (Website -> GAS -> Telegram)
  app.post("/api/contact", async (req, res) => {
    const { name, contact, type, promo, message } = req.body;
    const gasUrl = process.env.GOOGLE_APPS_SCRIPT_URL || "https://script.google.com/macros/s/AKfycbzM8oA0WhkFFETFLmmDooHrVbCGXcLSk-O_TNASr5eBIbd6f1C-SUnN3GRWcJr2kDdr/exec";

    try {
      const response = await fetch(gasUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name: name || "",
          contact: contact || "",
          type: type || "",
          promo: promo || "Нет",
          message: message || ""
        })
      });

      if (!response.ok) {
        throw new Error(`Google Apps Script responded with status ${response.status}`);
      }

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || 'Failed to submit to Google Apps Script');
      }

      res.json({ success: true });
    } catch (error) {
      console.error("GAS Form Submission Error:", error);
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
    app.use(express.static(distPath, {
      setHeaders: (res, filePath) => {
        const ext = path.extname(filePath).toLowerCase();
        const mimeTypes: Record<string, string> = {
          '.js': 'application/javascript; charset=utf-8',
          '.mjs': 'application/javascript; charset=utf-8',
          '.css': 'text/css; charset=utf-8',
          '.html': 'text/html; charset=utf-8',
          '.png': 'image/png',
          '.jpg': 'image/jpeg',
          '.jpeg': 'image/jpeg',
          '.gif': 'image/gif',
          '.svg': 'image/svg+xml',
          '.ico': 'image/x-icon',
          '.webp': 'image/webp',
          '.woff': 'font/woff',
          '.woff2': 'font/woff2',
          '.ttf': 'font/ttf',
          '.otf': 'font/otf',
          '.json': 'application/json; charset=utf-8'
        };
        if (mimeTypes[ext]) {
          res.setHeader('Content-Type', mimeTypes[ext]);
        }
      }
    }));
    app.get('*', (req, res) => {
      // Do not serve index.html for static asset paths or files with extensions
      if (req.path.startsWith('/assets/') || path.extname(req.path)) {
        res.status(404).send('Not Found');
        return;
      }
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
