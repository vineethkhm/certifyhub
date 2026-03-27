const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

// Route files
const authRoutes = require('./routes/authRoutes');
const certificateRoutes = require('./routes/certificateRoutes');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Body parser
app.use(express.json());

// Enable CORS
app.use(cors());

// Mount routers
app.use('/api/auth', authRoutes);
app.use('/api/certificates', certificateRoutes);

// Custom error handler (simple)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Server Error: Something went wrong.' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`[Server] running on port ${PORT}`));
