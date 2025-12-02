import express, { type Request, type Response } from 'express';
import path from 'path';
import { ENV } from './configs/env';

const app = express();
const PORT = ENV.PORT || 3000;
const __dirname = path.resolve();

app.get('/api/health', (req: Request, res: Response) => {
  return res.status(200).json({
    messsage: 'OK',
    success: true,
    timestamp: new Date().toISOString(),
  });
});

if (ENV.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../admin/dist')));
  app.get('/{*any}', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend', 'dist', 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`app is running on port ${PORT}`);
});
