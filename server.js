import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { connectDB, getDBStatus } from './config/db.js';
import expenseRoutes from './routes/expenseRoutes.js';
import { notFoundHandler, errorHandler } from './middleware/errorHandler.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// CORS configuration
const allowedOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:3000',
  process.env.CLIENT_URL,
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, Postman)
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(null, true); // Dev friendly
    },
    credentials: true,
  })
);

// Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// HTTP logger
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'Ledgerly MERN Expense API',
    timestamp: new Date().toISOString(),
    uptime: Math.floor(process.uptime()),
    database: getDBStatus() ? 'mongodb' : 'in-memory-fallback',
  });
});

// API Routes
app.use('/api/expenses', expenseRoutes);

// Error Handling
app.use(notFoundHandler);
app.use(errorHandler);

// Start server
const server = app.listen(PORT, () => {
  console.log(`
  \x1b[36m┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓\x1b[0m
  \x1b[36m┃\x1b[0m  \x1b[1m\x1b[32mLedgerly MERN Expense Management Backend\x1b[0m                  \x1b[36m┃\x1b[0m
  \x1b[36m┃\x1b[0m  \x1b[37mPort:\x1b[0m       http://localhost:${PORT}                           \x1b[36m┃\x1b[0m
  \x1b[36m┃\x1b[0m  \x1b[37mHealth:\x1b[0m     http://localhost:${PORT}/api/health                 \x1b[36m┃\x1b[0m
  \x1b[36m┃\x1b[0m  \x1b[37mEndpoints:\x1b[0m  http://localhost:${PORT}/api/expenses               \x1b[36m┃\x1b[0m
  \x1b[36m┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛\x1b[0m
  `);
});

// Graceful termination
process.on('SIGINT', async () => {
  console.log('\nShutting down Express server gracefully...');
  server.close(() => {
    console.log('Server process terminated.');
    process.exit(0);
  });
});

export default app;
