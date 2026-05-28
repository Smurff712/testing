import app from './app';
import { config } from './config';
import { prisma } from './lib/prisma';

const startServer = async () => {
  try {
    await prisma.$connect();
    console.log('Database connected successfully');

    app.listen(config.port, () => {
      console.log(`Server running on port ${config.port} in ${config.env} mode`);
      console.log(`API available at http://localhost:${config.port}/api`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    await prisma.$disconnect();
    process.exit(1);
  }
};

process.on('unhandledRejection', (reason: Error) => {
  console.error('Unhandled Rejection:', reason.message);
  process.exit(1);
});

process.on('uncaughtException', (error: Error) => {
  console.error('Uncaught Exception:', error.message);
  process.exit(1);
});

process.on('SIGTERM', async () => {
  console.log('SIGTERM received, shutting down...');
  await prisma.$disconnect();
  process.exit(0);
});

startServer();
