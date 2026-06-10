const app = require('./app');
const connectDB = require('./config/db');
const { port, nodeEnv } = require('./config/env');

const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectDB();

    // Start server
    app.listen(port, () => {
      console.log(`\n🚀 teamundo API Server`);
      console.log(`   Environment: ${nodeEnv}`);
      console.log(`   Port:        ${port}`);
      console.log(`   URL:         http://localhost:${port}`);
      console.log(`   Health:      http://localhost:${port}/api/health\n`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error.message);
    process.exit(1);
  }
};

startServer();
