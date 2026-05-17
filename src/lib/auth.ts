import { SignJWT, jwtVerify } from 'jose';

/**
 * Risk #6 Fix: JWT-based Admin Authentication
 * 
 * Replaces hardcoded static tokens with short-lived JWTs.
 * Tokens expire in 2 hours and can be revoked by rotating NEXTAUTH_SECRET.
 */

const rawSecret = process.env.NEXTAUTH_SECRET;

if (!rawSecret) {
  throw new Error(
    '[FATAL] NEXTAUTH_SECRET environment variable is not set. ' +
    'Generate one with: openssl rand -base64 32'
  );
}

const SECRET = new TextEncoder().encode(rawSecret);


export interface TokenPayload {
  sub: string;       // user identifier (e.g. email or admin ID)
  role: 'ADMIN' | 'PARTNER';
  iat?: number;
  exp?: number;
}

/**
 * Generate a signed JWT token with a 2-hour expiry.
 */
export async function signToken(payload: Omit<TokenPayload, 'iat' | 'exp'>): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('2h')
    .sign(SECRET);
}

/**
 * Verify and decode a JWT token.
 * Returns the payload if valid, or null if expired/tampered.
 */
export async function verifyToken(token: string): Promise<TokenPayload | null> {
  try {
    const { payload } = await jwtVerify(token, SECRET);
    return payload as unknown as TokenPayload;
  } catch {
    return null;
  }
}
