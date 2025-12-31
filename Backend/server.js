import express from 'express';
import cors from 'cors';
import connectDB from './config/db.js';
import mvdRoutes from './routes/mvdRoutes.js';
import userRoutes from './routes/userRoutes.js';
import profileRoutes from './routes/profileRoutes.js';
import adminRoutes from './routes/adminRoutes.js'; // 1. Import Admin Routes
import adminUserRoutes from './routes/adminUserRoutes.js';
import schedulerRoutes from './routes/adminSchedulerRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import userPaymentRoutes from './routes/userPaymentRoutes.js';
import vehicleDetailsRoutes from './routes/vehicleDetailsRoutes.js';
import licenseDetailsRoutes from './routes/licenseDetailsRoutes.js';
import reminderRoutes from './routes/reminderRoutes.js';
import vehicleRoutes from './routes/mvdRoutes.js';
import slotRoutes from './routes/slotRoutes.js';
const app = express();
const PORT = 8080;

// Connect to MongoDB
connectDB();

// INCREASE PAYLOAD LIMITS
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

app.use(cors());

// 2. MAP THE ROUTES
app.use('/api/mvd', mvdRoutes);
app.use('/api/users', userRoutes);
app.use('/api/profiles', profileRoutes);
app.use('/api/admin', adminRoutes); // 3. New Admin endpoint
app.use('/api/admin/management', adminUserRoutes);
app.use('/api/admin/scheduler', schedulerRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/user-payments', userPaymentRoutes);
app.use('/api/vehicle-details', vehicleDetailsRoutes);
app.use('/api/license-details', licenseDetailsRoutes);
app.use('/api/reminders', reminderRoutes);
app.use('/api/vehicle', vehicleRoutes);
app.use('/api/slots', slotRoutes);
app.get('/', (req, res) => res.send('Driving School Server Running...'));

// ERROR HANDLING FOR LARGE PAYLOADS
app.use((err, req, res, next) => {
    if (err.type === 'entity.too.large') {
        return res.status(413).json({ 
            success: false, 
            message: "The image file is too large. Please select a smaller photo." 
        });
    }
    next(err);
});

app.listen(PORT, () => {
    console.log(`🚀 Server active on http://localhost:${PORT}`);
    console.log(`📸 Cloudinary uploads enabled (Max: 50MB)`);
    console.log(`🔐 Admin Security Layer Active`);
});