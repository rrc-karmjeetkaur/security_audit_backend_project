import express from 'express';
import { accessLogger, errorLogger, consoleLogger } from './api/v1/middleware/logger';
import errorHandler from './api/v1/middleware/errorHandler';
import loansRoutes from './api/v1/routes/loans.routes';
import adminRoutes from './api/v1/routes/admin.routes';

const app = express();

if (process.env.NODE_ENV === 'production') {
  app.use(accessLogger);
  app.use(errorLogger);
} else {
  app.use(consoleLogger);
}

app.use(express.json());

app.use('/api/v1/loans', loansRoutes);
app.use('/api/v1/admin', adminRoutes);

app.use(errorHandler);

export default app;

