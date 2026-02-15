import { type Request, type Response, type NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// 1. Define the shape of your JWT payload
interface JwtPayload {
  id: string;
}

// 2. Extend the Express Request type globally or locally
export interface AuthenticatedRequest extends Request {
  user?: { id: string }; // You can add more fields as needed
}

export const protect = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ error: "Unauthorized: No session found. Please login." });
  }

  try {
    // 3. Verify the token using your environment secret
    const decoded = jwt.verify(token, process.env.TOKEN_SECRET!) as JwtPayload;

    // 4. Attach the ID cleanly without using 'any'
    req.user = { id: decoded.id }; 
    
    next();
  } catch (error) {
    // Clear the cookie if the token is invalid to prevent "infinite" error loops
    res.clearCookie('token');
    return res.status(401).json({ error: "Unauthorized: Session expired or invalid token." });
  }
};