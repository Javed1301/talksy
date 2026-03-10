import { Router } from "express";
import authRouter from "./auth.js";
import userRouter from "./users.js";
import chatRouter from "./chats.js";

const apiRouter = Router();


/*
  All /api routes here
*/

// /api/auth → authRouter
apiRouter.use("/auth", authRouter);

// /api/users → userRouter
apiRouter.use("/users", userRouter);

// /api/chats → chatRouter
apiRouter.use("/chats", chatRouter);

export default apiRouter;
