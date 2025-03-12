import express from 'express';
import path from 'node:path';

const app = express();

app.use(express.static(path.join(import.meta.dirname, 'dist')));

app.get('*', (req, res) => {
  res.sendFile(path.join(import.meta.dirname, 'dist', 'index.html'));
});

const PORT = 3001;

app.listen(PORT, () => {
  console.log(`Dashboard is running on port ${PORT}`);
});
