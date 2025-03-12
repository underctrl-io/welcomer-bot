import type { Request } from 'express';

export type JwtPayload = {
  id: string;
  username: string;
  avatar: string | null;
};

export type AuthRequest = Request & {
  user: JwtPayload;
};
