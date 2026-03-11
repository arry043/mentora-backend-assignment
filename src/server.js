import app from './app.js';
import { connectDB } from './config/db.js';
import { env } from './config/env.js';

const startServer = async () => {
  await connectDB();
  
  const port = env.PORT || 3000;
  app.listen(port, () => {
    console.log(`🚀 Server running in ${env.NODE_ENV} mode on port ${port}`);
  });
};

startServer();
