import express from "express";
import { createServer } from "http";
import { setupVite, serveStatic } from "./vite.js";
import { registerRoutes } from "./routes.js";
import { getStorage } from "./storage.js";

const app = express();
const server = createServer(app);

// CORS middleware for frontend-backend communication
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:5173');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');

  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Initialize storage connection
try {
  const storage = await getStorage();
  if (typeof storage.connect === 'function') {
    await storage.connect();
    console.log("Storage initialized successfully");
  }
} catch (error) {
  console.error("Failed to initialize storage:", error);
}

// Register API routes
registerRoutes(app);

const port = process.env.PORT || 3000;

if (process.env.NODE_ENV === "development") {
  await setupVite(app, server);
} else {
  serveStatic(app);
}

server.listen(port, "0.0.0.0", () => {
  console.log(`Backend server running on http://0.0.0.0:${port}`);
});