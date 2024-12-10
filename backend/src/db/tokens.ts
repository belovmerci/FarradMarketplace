import jwt from 'jsonwebtoken';

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || 'your-access-token-secret';
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || 'your-refresh-token-secret';

/**
 * Generate an access token with a short lifespan (15 minutes).
 * @param userId - The ID of the user for whom the token is generated.
 * @returns A signed JWT access token.
 */
export const generateAccessToken = (userId: number): string => {
  console.log(userId);
  console.log(jwt.decode(jwt.sign({ userId }, ACCESS_TOKEN_SECRET, { expiresIn: '15m' })));
  return jwt.sign({ userId }, ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
};

/**
 * Generate a refresh token with a longer lifespan (7 days).
 * @param userId - The ID of the user for whom the token is generated.
 * @returns A signed JWT refresh token.
 */
export const generateRefreshToken = (userId: number): string => {
  return jwt.sign({ userId }, REFRESH_TOKEN_SECRET, { expiresIn: '7d' });
};

/**
 * Verify the validity of the provided access token.
 * @param token - The token to verify.
 * @returns The decoded token if valid, or null if invalid.
 */
export const verifyAccessToken = (token: string): { userId: number } | null => {
  try {
    return jwt.verify(token, ACCESS_TOKEN_SECRET) as { userId: number };
  } catch (error) {
    return null;
  }
};

/**
 * Verify the validity of the provided refresh token.
 * @param token - The token to verify.
 * @returns The decoded token if valid, or null if invalid.
 */
export const verifyRefreshToken = (token: string): { userId: number } | null => {
  try {
    return jwt.verify(token, REFRESH_TOKEN_SECRET) as { userId: number };
  } catch (error) {
    return null;
  }
};