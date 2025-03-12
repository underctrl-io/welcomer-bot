import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { connectToDatabase } from './lib/mongodb.js';
import routes from './routes.js';

const app = express();

app.use(
  cors({
    origin: process.env.DASHBOARD_URL,
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json());
app.use(routes);

connectToDatabase().then(() => {
  const PORT = process.env.PORT || 3000;

  app.listen(PORT, () => {
    console.log(`API is running on port ${PORT}`);
  });
});
