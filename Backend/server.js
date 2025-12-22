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

// Connect to MongoDB
connectDB();

// Increase payload limits
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

app.use(cors());

// Map routes
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

// Root endpoint
app.get('/', (req, res) => res.send('🚀 Driving School Server Running...'));

// Error handling for large payloads
app.use((err, req, res, next) => {
  if (err.type === 'entity.too.large') {
    return res.status(413).json({ 
      success: false, 
      message: "The image file is too large. Please select a smaller photo." 
    });
  }
  next(err);
});

// === Vercel export ===
export const handler = serverless(app);

// === Local development ===
if (process.env.NODE_ENV !== 'production') {
  const PORT = 8080;
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📸 Cloudinary uploads enabled (Max: 50MB)`);
    console.log(`🔐 Admin Security Layer Active`);
  });
}
