import jwt from "jsonwebtoken";

interface JwtPayload {
  userId: string;
}

export function verifyToken(token: string) {
  return jwt.verify(
    token,
    process.env.JWT_SECRET!
  ) as JwtPayload;
}