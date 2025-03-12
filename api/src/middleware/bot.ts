import type { NextFunction, Request, Response } from 'express';

const { DISCORD_BOT_TOKEN } = process.env;

if (!DISCORD_BOT_TOKEN) {
  throw new Error('DISCORD_BOT_TOKEN is not defined');
}

const botMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token || token !== DISCORD_BOT_TOKEN) {
    res.sendStatus(401);
    return;
  }

  next();
};

export default botMiddleware;
