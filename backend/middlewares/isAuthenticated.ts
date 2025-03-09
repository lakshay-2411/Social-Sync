import jwt from "jsonwebtoken";

import { Request, Response, NextFunction } from "express";

const isAuthenticated = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    const token = req.cookies?.token;
    if (!token) {
      res
        .status(401)
        .json({ message: "User not authenticated", success: false });
      return;
    }

    const decode = jwt.verify(
      token,
      process.env.SECRET_KEY as string
    ) as jwt.JwtPayload;
    if (!decode) {
      res.status(401).json({ message: "Invalid token", success: false });
      return;
    }
    (req as any).id = decode.userId;
    next();
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error", success: false });
    return;
  }
};

export default isAuthenticated;
