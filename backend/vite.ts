
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import express, { type Express } from "express";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export async function setupVite(app: Express, server: any) {
  // Dynamic import to avoid bundling Vite in production
  const { createServer: createViteServer } = await import("vite");
  
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: "spa",
    root: path.resolve(__dirname, "../frontend"),
  });

  app.use(vite.ssrFix);
  app.use(vite.middlewares);
}

export function serveStatic(app: Express) {
  const publicDir = path.resolve(__dirname, "../frontend/dist");
  
  if (fs.existsSync(publicDir)) {
    app.use(express.static(publicDir));
    
    app.get("*", (req, res, next) => {
      if (req.url.startsWith("/api")) {
        return next();
      }
      
      const indexPath = path.resolve(publicDir, "index.html");
      if (fs.existsSync(indexPath)) {
        res.sendFile(indexPath);
      } else {
        res.status(404).send("Frontend build not found");
      }
    });
  } else {
    app.get("*", (req, res, next) => {
      if (req.url.startsWith("/api")) {
        return next();
      }
      res.status(404).send("Frontend build not found. Run npm run build first.");
    });
  }
}
