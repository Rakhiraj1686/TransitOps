const dotenv = require('dotenv');
// dotenv.config();
const result = dotenv.config();

// 👇 Debug logs
console.log("Dotenv Result:", result);
console.log("JWT_SECRET:", process.env.JWT_SECRET);
console.log("Current Directory:", process.cwd());

const app = require('./app');
const connectDB = require('./config/db');

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`[TransitOps API] Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  });
};

process.on('unhandledRejection', (err) => {
  console.error(`Unhandled Rejection: ${err.message}`);
});

startServer();
