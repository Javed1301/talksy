import { Router } from "express";

const healthRouter = Router();

/**
 * GET /health
 * Used to check if server is alive
 */

healthRouter.get("/health",(req,res)=>{
 res.status(200).json({
  status: "ok",
 });
});

export default healthRouter;