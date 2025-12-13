import { Router } from "express";
import { AuthController } from "./controllers/AuthController";

export function createRouter(authController: AuthController): Router {
  const router = Router();

  // Autenticación
  router.post("/auth/login", authController.login);

  // Registro de estudiantes
  router.post(
    "/auth/register/student/adult",
    authController.registerAdultStudent
  );
  router.post(
    "/auth/register/student/minor",
    authController.registerMinorStudent
  );

  // Registro de tutores
  router.post("/auth/register/tutor", authController.registerTutor);

  router.delete("/auth/management/tutor", authController.deleteTutor);

  router.delete("/auth/management/student", authController.deleteStudent);

  router.get("/auth/management", authController.showAccountDeletionPage);

  return router;
}
