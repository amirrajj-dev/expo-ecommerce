import express, { type Request, type Response } from 'express';

const app = express();

app.get('/health', (req: Request, res: Response) => {
  return res.status(200).json({
    messsage: 'OK',
    success: true,
    timestamp: new Date().toISOString(),
  });
});

app.listen(3000, () => {
  console.log(`app is running on port ${3000}`);
});
