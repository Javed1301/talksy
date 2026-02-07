import express from "express";
import healthRouter from "./routes/health.js";

const app = express();

app.use(healthRouter);

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
