import express from "express";
import healthRouter from "./routes/health.js";
import apiRouter
 from "./routes/api/index.js";
const app = express();
app.use(express.json());


app.use(healthRouter);
app.use("/api",apiRouter);

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
