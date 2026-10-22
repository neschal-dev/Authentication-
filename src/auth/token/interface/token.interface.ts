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
