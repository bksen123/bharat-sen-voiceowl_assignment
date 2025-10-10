import { Request, Response, NextFunction } from "express";
import JWT, { JwtPayload } from "jsonwebtoken";
import { msgHandler } from "../core/messages";

/* -------------------------------------------------------------------------- */
/*                                 JWT Auth Verify                            */
/* -------------------------------------------------------------------------- */

// callback
export const verifyToken = async (req: Request, res: Response, next: NextFunction) => {
  const authorization = req.headers.authorization;

  if (!authorization) {
    return res.status(401).json({ message: msgHandler('token', 'JWT_REQUIRED') });
  }

  const token = authorization.split(" ")[1];

  try {
    const authData = JWT.verify(token, process.env.ACCESS_TOKEN_SECRET!) as JwtPayload;

    if (!authData) {
      return res.status(401).json({ message: msgHandler('token', 'UNAUTHORIZED_USER') });
    }

    // Optionally attach authData to request
    (req as any).authData = authData;

    return next();
  } catch (error: any) {
    return res.status(401).json({ message: error.message || error });
  }
};

/* -------------------------------------------------------------------------- */
/*                             Get Current Logged User                        */
/* -------------------------------------------------------------------------- */
export const currentLoggedUser = async (req: Request): Promise<JwtPayload | null> => {
  const authorization = req.headers.authorization;

  if (!authorization) return null;

  const token = authorization.split(" ")[1];

  try {
    const authData = JWT.verify(token, process.env.ACCESS_TOKEN_SECRET!) as JwtPayload;
    return authData;
  } catch (error) {
    return null;
  }
};

/* -------------------------------------------------------------------------- */
/*                                 JWT Auth Sign                               */
/* -------------------------------------------------------------------------- */
export const signJwt = async (payloadData: Record<string, any>): Promise<string> => {
  console.log("process.env.ACCESS_TOKEN_TIMEOUT_DURATION", process.env.ACCESS_TOKEN_TIMEOUT_DURATION);

  const token = JWT.sign(payloadData, process.env.ACCESS_TOKEN_SECRET!, {
    expiresIn: process.env.ACCESS_TOKEN_TIMEOUT_DURATION,
  });

  return token;
};
