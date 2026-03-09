import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import router from './app/routes';
import globalErrorHandler from './app/middleware/globalErrorhandler';

const app: Application = express();

// Middlewares
app.use(
  cors({
    origin: [
      'https://ecommerce-with-next-drab.vercel.app',
      'http://localhost:3000'
    ],
    credentials: true, 
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  })
);

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use('/api/v1', router);
app.use(globalErrorHandler);

// Not Found Route
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: 'API Not Found',
  });
});

// Testing Route
app.get('/', (req: Request, res: Response) => {
  res.send('Glowly Backend is Running! 🚀');
});

export default app;