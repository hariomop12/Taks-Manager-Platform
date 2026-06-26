import { dirname, join } from 'path';
import { existsSync } from 'fs';
import { fileURLToPath } from 'url';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import routes from './routes/index.js';
import errorHandler from './middleware/error.middleware.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const frontendDist = join(__dirname, '../../Frontend/dist');
const servesFrontend = existsSync(frontendDist);

const app = express();

app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors({ origin: true, credentials: true }));
app.use(compression());
app.use(morgan('dev'));
app.use(cookieParser());
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true }));

if (servesFrontend) {
  app.use(express.static(frontendDist));
}

app.use('/api/v1', routes);

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

if (servesFrontend) {
  app.get('*', (req, res) => {
    res.sendFile(join(frontendDist, 'index.html'));
  });
}

app.use(errorHandler);

export default app;
