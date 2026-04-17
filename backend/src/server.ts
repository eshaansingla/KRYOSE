import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import passport from 'passport';

// Import configs
import './config/passport';

// Import routes
import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';
import workspaceRoutes from './routes/workspace.routes';
import projectRoutes from './routes/project.routes';

// Import middleware
import { errorHandler, notFound } from './middleware/error.middleware';

// Import DB
import pool from './config/db';

// Load environment variables
dotenv.config();

// Create Express app
const app = express();

// Middleware
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Passport middleware
app.use(passport.initialize());

// Health check
app.get('/health', (_req, res) => {
    res.json({ success: true, message: 'Server is healthy' });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/workspaces', workspaceRoutes);
app.use('/api/projects', projectRoutes);

// 404 handler
app.use(notFound);

// Error handler
app.use(errorHandler);

// Test DB connection
const testDbConnection = async () => {
    try {
        await pool.query('SELECT 1');
        console.log('✅ Database connected successfully');
    } catch (err) {
        console.error('❌ Database connection failed:', err);
        process.exit(1);
    }
};

// Start server
const PORT = process.env.PORT || 5000;

const startServer = async () => {
    await testDbConnection();

    app.listen(PORT, () => {
        console.log(`🚀 Server running on port ${PORT}`);
        console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
    });
};

startServer().catch((err) => {
    console.error('❌ Failed to start server:', err);
    process.exit(1);
});
