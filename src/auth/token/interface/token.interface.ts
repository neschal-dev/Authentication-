export interface SignedRefreshToken {
  id: string;
  token: string;
  expiresAt: Date;
}

export interface SaveRefreshTokenInput {
  id: string;
  userId: string;
  token: string;
  expiresAt: Date;
}

export interface AccessTokenPayload {
  sub: string;
  iat: number;
  exp: number;
}

export interface RefreshTokenPayload {
  sub: string;
  jti: string; // = RefreshToken row id
  iat: number;
  exp: number;
}