// apps/server/src/router/health.ts
import { Router } from 'express';
import { prisma } from '../lib/prisma.js'; // Ensure the .js extension is here!

const router = Router();

router.get('/', async (req, res) => {
  try {
    // Ping the database to ensure the Prisma adapter is live
    await prisma.$queryRaw`SELECT 1`;
    
    res.json({
      status: "Green 🟢",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      db_connection: "Healthy",
      authored_by: "Javed & Himanshu"
    });
  } catch (error) {
    res.status(503).json({
      status: "Red 🔴",
      db_connection: "Disconnected",
      error: error instanceof Error ? error.message : "Unknown Database Error"
    });
  }
});

export default router;