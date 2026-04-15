import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import fs from "fs/promises";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

async function startServer() {
  const app = express();
  const PORT = 3000;
  const WORKSPACE_DIR = path.join(process.cwd(), "workspace");

  // Ensure workspace exists
  try {
    await fs.mkdir(WORKSPACE_DIR, { recursive: true });
  } catch (e) {}

  app.use(express.json());

  // --- Neural Workspace API ---

  // List files in workspace
  app.get("/api/workspace", async (req, res) => {
    try {
      const files = await fs.readdir(WORKSPACE_DIR);
      const fileData = await Promise.all(files.map(async (file) => {
        const stats = await fs.stat(path.join(WORKSPACE_DIR, file));
        return { name: file, isDirectory: stats.isDirectory() };
      }));
      res.json(fileData);
    } catch (error) {
      res.status(500).json({ error: "Failed to read workspace" });
    }
  });

  // Read file
  app.get("/api/workspace/:filename", async (req, res) => {
    try {
      const content = await fs.readFile(path.join(WORKSPACE_DIR, req.params.filename), "utf-8");
      res.json({ content });
    } catch (error) {
      res.status(404).json({ error: "File not found" });
    }
  });

  // Write file
  app.post("/api/workspace", async (req, res) => {
    const { filename, content } = req.body;
    try {
      await fs.writeFile(path.join(WORKSPACE_DIR, filename), content);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to write file" });
    }
  });

  // Execute command in workspace
  app.post("/api/execute", async (req, res) => {
    const { command } = req.body;
    try {
      // Restricted execution for safety
      const { stdout, stderr } = await execAsync(command, { cwd: WORKSPACE_DIR, timeout: 10000 });
      res.json({ stdout, stderr });
    } catch (error: any) {
      res.status(500).json({ error: error.message, stdout: error.stdout, stderr: error.stderr });
    }
  });

  // --- Vite Middleware ---
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Aegis Sovereign Server running on http://localhost:${PORT}`);
    console.log(`Neural Workspace active at: ${WORKSPACE_DIR}`);
  });
}

startServer();
