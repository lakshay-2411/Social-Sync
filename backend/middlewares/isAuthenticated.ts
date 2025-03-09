import jwt from "jsonwebtoken";

import { Request, Response, NextFunction } from "express";

const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies?.token;
    if (!token) {
      return res
        .status(401)
        .json({ message: "User not authenticated", success: false });
    }

    const decode = jwt.verify(
      token,
      process.env.SECRET_KEY as string
    ) as jwt.JwtPayload;
    if (!decode) {
      return res.status(401).json({ message: "Invalid token", success: false });
    }
    (req as any).id = decode.userId;
    next();
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Internal server error", success: false });
  }
};

export default isAuthenticated;
