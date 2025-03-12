import axios from 'axios';
import { Router } from 'express';
import jwt from 'jsonwebtoken';
import authMiddleware from '../middleware/auth.js';
import User from '../models/User.js';
import type { AuthRequest } from '../types.js';

const {
  DISCORD_CLIENT_ID,
  DISCORD_CLIENT_SECRET,
  API_URL,
  DASHBOARD_URL,
  JWT_SECRET,
} = process.env;

if (
  !DISCORD_CLIENT_ID ||
  !DISCORD_CLIENT_SECRET ||
  !API_URL ||
  !DASHBOARD_URL ||
  !JWT_SECRET
) {
  throw new Error(
    'DISCORD_CLIENT_ID, DISCORD_CLIENT_SECRET, API_URL, DASHBOARD_URL or JWT_SECRET is not defined'
  );
}

const requiredScope = ['identify', 'guilds'];

const router = Router();

// http://localhost:3000/auth
router.get('/', authMiddleware, (req, res) => {
  const user = (req as AuthRequest).user;
  if (!user) {
    res.sendStatus(401);
    return;
  }

  res.json(user);
});

// http://localhost:3000/auth/login
router.get('/login', (req, res) => {
  res.redirect(
    `https://discord.com/oauth2/authorize?${new URLSearchParams({
      client_id: DISCORD_CLIENT_ID,
      redirect_uri: `${API_URL}/auth/callback`,
      response_type: 'code',
      scope: requiredScope.join(' '),
      prompt: 'none',
    })}`
  );
});

// http://localhost:3000/auth/callback
router.get('/callback', async (req, res) => {
  try {
    const { code } = req.query;
    if (!code) {
      res.send('No callback code provided');
      return;
    }

    const response = await axios.post(
      'https://discord.com/api/v10/oauth2/token',
      {
        client_id: DISCORD_CLIENT_ID,
        client_secret: DISCORD_CLIENT_SECRET,
        grant_type: 'authorization_code',
        redirect_uri: `${API_URL}/auth/callback`,
        code,
      },
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );

    const {
      access_token,
      refresh_token,
      expires_in,
      scope: providedScope,
    } = response.data;

    const hasMinimumScope = requiredScope.every((scope) =>
      providedScope.split(' ').includes(scope)
    );

    if (!hasMinimumScope) {
      res.sendStatus(400);
      return;
    }

    const userResponse = await axios.get(
      'https://discord.com/api/v10/users/@me',
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }
    );

    const { id, username, avatar } = userResponse.data;

    await User.findOneAndUpdate(
      { id },
      {
        accessToken: access_token,
        accessTokenExpiresAt: new Date(Date.now() + 1000 * expires_in),
        refreshToken: refresh_token,
      },
      { upsert: true, new: true }
    );

    const token = jwt.sign({ id, username, avatar }, JWT_SECRET, {
      expiresIn: '14d',
    });

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 14 * 24 * 60 * 60 * 1000,
    });

    res.redirect(DASHBOARD_URL);
  } catch (error: any) {
    console.error('Error in GET /auth/callback', error);
    res.sendStatus(error.response?.status || 500);
  }
});

// http://localhost:3000/auth/logout
router.get('/logout', (req, res) => {
  res.clearCookie('token');
  res.redirect(DASHBOARD_URL);
});

export default router;
