import express from 'express';
import cors from 'cors';
import serverless from 'serverless-http';
import connectDB from './config/db.js';

// Import routes
import mvdRoutes from './routes/mvdRoutes.js';
import userRoutes from './routes/userRoutes.js';
import profileRoutes from './routes/profileRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import adminUserRoutes from './routes/adminUserRoutes.js';
import schedulerRoutes from './routes/adminSchedulerRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import userPaymentRoutes from './routes/userPaymentRoutes.js';
import vehicleDetailsRoutes from './routes/vehicleDetailsRoutes.js';
import licenseDetailsRoutes from './routes/licenseDetailsRoutes.js';
import reminderRoutes from './routes/reminderRoutes.js';

const app = express();

// === MongoDB connection (serverless-safe) ===
let mongoConnected = false;
const connectOnce = async () => {
  if (!mongoConnected) {
    try {
      await connectDB();
      mongoConnected = true;
      console.log('📦 MongoDB Connected');
    } catch (err) {
      console.error('❌ MongoDB connection error:', err);
    }
  }
};
connectOnce();

// === Body parser / Payload limit ===
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// === CORS Setup ===
const allowedOrigins = [
  'https://johnsdrivingschool.vercel.app',
  'http://localhost:3000'
];

app.use(cors({
  origin: function(origin, callback) {
    if (!origin) return callback(null, true); // allow curl or mobile apps
    if (allowedOrigins.indexOf(origin) === -1) {
      return callback(new Error('CORS policy does not allow access from this origin'), false);
    }
    return callback(null, true);
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// Handle preflight OPTIONS requests
app.options('*', cors({
  origin: allowedOrigins,
  methods: ['GET','POST','PUT','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization'],
  credentials: true
}));

// === Routes ===
app.use('/api/mvd', mvdRoutes);
app.use('/api/users', userRoutes);
app.use('/api/profiles', profileRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/admin/management', adminUserRoutes);
app.use('/api/admin/scheduler', schedulerRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/user-payments', userPaymentRoutes);
app.use('/api/vehicle-details', vehicleDetailsRoutes);
app.use('/api/license-details', licenseDetailsRoutes);
app.use('/api/reminders', reminderRoutes);

// === Root endpoint ===
app.get('/', (req, res) => res.send('🚀 Driving School Server Running...'));

// === Error handling for large payloads ===
app.use((err, req, res, next) => {
  if (err.type === 'entity.too.large') {
    return res.status(413).json({ 
      success: false, 
      message: "The image file is too large. Please select a smaller photo." 
    });
  }
  next(err);
});

// === Serverless export for Vercel ===
export const handler = serverless(app);

// === Local development ===
if (process.env.NODE_ENV !== 'production') {
  const PORT = 8080;
  app.listen(PORT, () => {
    console.log(`🚀 Local Server running on http://localhost:${PORT}`);
    console.log(`📸 Cloudinary uploads enabled (Max: 50MB)`);
    console.log(`🔐 Admin Security Layer Active`);
  });
}
