import jwt, { Secret, JwtPayload, SignOptions } from 'jsonwebtoken';
const generateToken = (
  payload: object,
  secretKey: Secret,
  expiresIn: number | string,
) => {
  return jwt.sign(payload, secretKey, { expiresIn: expiresIn as any });
};

const verifyToken = (verifyToken: string, secretKey: Secret) => {
  const jwtPayloadData: JwtPayload = jwt.verify(
    verifyToken,
    secretKey,
  ) as JwtPayload;
  return jwtPayloadData;
};

export const jwtHelper = {
  generateToken,
  verifyToken,
};
