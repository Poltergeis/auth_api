import dotenv from "dotenv";
dotenv.config();
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { DependencyContainer } from './infrastructure/di';
import { InvalidCredentialsError, UserAlreadyExistsError } from './domain/Errors';
import { createRouter } from './infrastructure/router';

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(helmet());
app.use(cors());
app.use(express.json());

// Dependency Injection
const container = DependencyContainer.getInstance();

// Routes
app.use('/api', createRouter(container.authController));

// Health check
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Global Error Handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('Error:', err);

  if (err instanceof InvalidCredentialsError) {
    res.status(401).json({ message: err.message });
    return;
  }

  if (err instanceof UserAlreadyExistsError) {
    res.status(409).json({ message: err.message });
    return;
  }

  if (err.message === 'Token inválido o expirado') {
    res.status(401).json({ message: err.message });
    return;
  }

  // Error genérico
  res.status(500).json({ 
    message: 'Ha ocurrido un error interno del servidor',
    ...(process.env.NODE_ENV === 'development' && { error: err.message })
  });
});

// 404 Handler
app.use((req: Request, res: Response) => {
  res.status(404).json({ message: 'Ruta no encontrada' });
});

// Start server
app.listen(PORT, async () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
});

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n🛑 Cerrando servidor...');
  await container.disconnect();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\n🛑 Cerrando servidor...');
  await container.disconnect();
  process.exit(0);
});