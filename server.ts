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
    const gasUrl = process.env.GOOGLE_APPS_SCRIPT_URL || "https://script.google.com/macros/s/AKfycbx_pOmnP8fG3fuhQx4R6X3Z9tc_H_jykufPZCUaR82Fx4ruqy04nYMWxvk5_xj-UvS2/exec";

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
