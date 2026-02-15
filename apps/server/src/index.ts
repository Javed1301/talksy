import express from 'express';
import cookieParser from 'cookie-parser'; // To read JWT cookies
import cors from 'cors'; // For your Next.js frontend to connect
import healthRouter from './routes/health.js';
import authRouter from './routes/auth.router.js'; // We will create this next
import userRouter from './routes/user.rouer.js'; // We will create this next

const app = express();
const PORT = 5000;

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173", // Your Next.js URL
    credentials: true, // Allow cookies to be sent
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Routes
app.use('/health', healthRouter);
app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);


app.listen(PORT, () => {
  console.log(`🚀 Server for Javed & Himanshu running on http://localhost:${PORT}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/health`);
});