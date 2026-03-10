import { Router } from "express";

const authRouter = Router();


// POST /api/auth/register
authRouter.post("/register", (req, res) => {
  const { phoneNumber, name } = req.body;

  res.status(201).json({
    message: "User registered",
    data: {
      phoneNumber,
      name,
    },
  });
});

/*
  All authentication related routes
  will live here
  
*/



export default authRouter;
