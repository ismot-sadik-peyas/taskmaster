const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const promClient = require('prom-client');
const taskRoutes = require('./routes/tasks');
const authRoutes = require('./routes/auth');
const { errorHandler } = require('./middleware/errorHandler');
const path = require('path');

const app = express();

// Prometheus
const register = new promClient.Registry();
promClient.collectDefaultMetrics({ register });

const httpReqTotal = new promClient.Counter({
  name: 'http_requests_total',
  help: 'Total HTTP requests',
  labelNames: ['method', 'route', 'status'],
  registers: [register],
});

const httpDuration = new promClient.Histogram({
  name: 'http_request_duration_seconds',
  help: 'HTTP request duration',
  labelNames: ['method', 'route'],
  buckets: [0.05, 0.1, 0.3, 0.5, 1, 2],
  registers: [register],
});

// Middleware
app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Metrics middleware
app.use((req, res, next) => {
  const end = httpDuration.startTimer({ method: req.method, route: req.path });
  res.on('finish', () => {
    end();
    httpReqTotal.inc({ method: req.method, route: req.path, status: res.statusCode });
  });
  next();
});

// Serve frontend
app.use(express.static(path.join(__dirname, '../../frontend/public')));

// Health
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: Math.round(process.uptime()),
    version: process.env.APP_VERSION || '1.0.0',
    environment: process.env.NODE_ENV || 'development'
  });
});

// Metrics
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', register.contentType);
  res.end(await register.metrics());
});


// API routes
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

// Catch-all
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../../frontend/public/index.html'));
});

app.use(errorHandler);

module.exports = { app, register };
