import { Request, Response, NextFunction } from "express";
import { msgHandler } from "./messages";
import JWT, { JwtPayload, SignOptions } from "jsonwebtoken";

const secret = process.env.ACCESS_TOKEN_SECRET;

if (!secret) {
  throw new Error("ACCESS_TOKEN_SECRET is not defined");
}

/* -------------------------------------------------------------------------- */
/*                                 JWT Auth Verify                            */
/* -------------------------------------------------------------------------- */
export const verifyToken = async (req: Request, res: Response, next: NextFunction) => {
  const authorization = req.headers.authorization;

  if (!authorization) {
    return res.status(401).json({ message: msgHandler('token', 'JWT_REQUIRED') });
  }

  const token = authorization.split(" ")[1];

  try {
    const authData = JWT.verify(token, secret) as JwtPayload;

    if (!authData) {
      return res.status(401).json({ message: msgHandler('token', 'UNAUTHORIZED_USER') });
    }

    // Attach authData to request
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
    const authData = JWT.verify(token, secret) as JwtPayload;
    return authData;
  } catch (error) {
    return null;
  }
};

/* -------------------------------------------------------------------------- */
/*                                 JWT Auth Sign                               */
/* -------------------------------------------------------------------------- */
export const signJwt = async (payloadData: Record<string, any>): Promise<string> => {
  const expiresIn:any = process.env.ACCESS_TOKEN_TIMEOUT_DURATION || "1h"; // fallback

  const options: SignOptions = { expiresIn };

  const token = JWT.sign(payloadData, secret, options);

  return token;
};
