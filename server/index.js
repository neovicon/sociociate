const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const connectDB = require('./src/config/db');
const { startAgenda } = require('./src/services/scheduler');

dotenv.config();
connectDB();

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.use('/api/auth', require('./src/routes/authRoutes'));
app.use('/api/oauth', require('./src/routes/oauthRoutes'));
app.use('/api/posts', require('./src/routes/postRoutes'));
app.use('/api/analytics', require('./src/routes/analyticsRoutes'));
app.use('/api/social-accounts', require('./src/routes/socialAccountRoutes'));
app.use('/api/upload', require('./src/routes/uploadRoutes'));
app.get('/', (req, res) => {
  res.send('SocioCiate API is running');
});

// Error Handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
  await startAgenda();
});
