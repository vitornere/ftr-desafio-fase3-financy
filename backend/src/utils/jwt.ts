/** biome-ignore-all lint/style/noNonNullAssertion: allow null */
import jwt from 'jsonwebtoken';

export type JwtPayload = {
  id: string;
  email: string;
};

export const signJwt = (
  payload: JwtPayload,
  expiresIn?: NonNullable<jwt.SignOptions['expiresIn']>,
) => {
  return jwt.sign(payload, process.env.JWT_SECRET!, {
    expiresIn: expiresIn ?? '1h',
  });
};

export const verifyJwt = (token: string) => {
  return jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
};
