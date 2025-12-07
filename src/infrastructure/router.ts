import { Router } from 'express';
import { AuthController } from './controllers/AuthController';

export function createRouter(authController: AuthController): Router {
  const router = Router();

  router.post('/auth/login', authController.login);
  router.post('/auth/register/adult', authController.registerAdult);
  router.post('/auth/register/tutor', authController.registerTutor);

  return router;
}