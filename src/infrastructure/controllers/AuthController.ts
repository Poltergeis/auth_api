import { Request, Response, NextFunction } from "express";
import { LoginUseCase } from "../../application/LoginUseCase";
import { RegisterAdultStudentUseCase } from "../../application/RegisterAdultStudentUseCase";
import { RegisterTutorUseCase } from "../../application/RegisterTutorUseCase";
import { RegisterMinorStudentUseCase } from "../../application/RegisterMinorStudentUseCase";
import {
  LoginRequestDTO,
  RegisterAdultStudentRequestDTO,
  RegisterTutorRequestDTO,
  RegisterMinorStudentRequestDTO,
  AuthResponseDTO,
  TutorResponseDTO,
  StudentResponseDTO,
} from "../models/http/DTOs";
import DeleteTutorUseCase from "../../application/DeleteTutorUseCase";
import DeleteStudentUseCase from "../../application/DeleteStudentUseCase";

export class AuthController {
  constructor(
    private readonly loginUseCase: LoginUseCase,
    private readonly registerAdultStudentUseCase: RegisterAdultStudentUseCase,
    private readonly registerTutorUseCase: RegisterTutorUseCase,
    private readonly registerMinorStudentUseCase: RegisterMinorStudentUseCase,
    private readonly deleteTutorUseCase: DeleteTutorUseCase,
    private readonly deleteStudentUseCase: DeleteStudentUseCase
  ) {}

  login = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { email, password } = req.body as LoginRequestDTO;

      if (!email || !password) {
        res.status(400).json({ message: "Email y contraseña son requeridos" });
        return;
      }

      const result = await this.loginUseCase.login(email, password);

      const response: AuthResponseDTO = {
        user: {
          id: result.user.id,
          email: result.user.email,
          name: result.user.name,
          userType: result.userType,
          createdAt: result.user.createdAt,
        },
        token: result.token,
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  };
  showAccountDeletionPage = (req: Request, res: Response) => {
    res.send(`
    <!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Eliminación de Cuenta - [Nombre de tu App]</title>
        <style>
            body { font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; }
            .warning { background-color: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 5px; margin: 20px 0; }
            .step { background-color: #f8f9fa; padding: 15px; margin: 10px 0; border-radius: 5px; }
            .contact-info { background-color: #d4edda; padding: 15px; border-radius: 5px; margin: 20px 0; }
        </style>
    </head>
    <body>
        <h1>Eliminación de Cuenta - [Nombre de tu App]</h1>
        
        <div class="warning">
            <strong>⚠️ Advertencia:</strong> La eliminación de cuenta es permanente e irreversible.
        </div>

        <h2>¿Cómo eliminar tu cuenta?</h2>
        
        <div class="step">
            <h3>Opción 1: Desde la aplicación</h3>
            <p>Ve a Ajustes > Eliminar Cuenta y sigue las instrucciones.</p>
        </div>

        <div class="step">
            <h3>Opción 2: Contacto directo</h3>
            <p>Envía un email a <strong>soporte@tuapp.com</strong> con el asunto "Solicitud de eliminación de cuenta" e incluye:</p>
            <ul>
                <li>Tu email registrado</li>
                <li>Confirmación de que deseas eliminar permanentemente tu cuenta</li>
            </ul>
        </div>

        <h2>¿Qué datos se eliminan?</h2>
        <ul>
            <li><strong>Se eliminan:</strong> Información personal, progreso académico, configuraciones de usuario</li>
            <li><strong>Se conservan temporalmente (30 días):</strong> Registros de transacciones por motivos legales</li>
            <li><strong>Se conservan permanentemente:</strong> Datos anonimizados para análisis estadísticos</li>
        </ul>

        <h2>Tiempo de procesamiento</h2>
        <p>Las solicitudes se procesan en un máximo de 30 días hábiles.</p>

        <div class="contact-info">
            <h3>¿Necesitas ayuda?</h3>
            <p>Email: softcode20246@gmail.com<br>
            Horario de atención: Lunes a Viernes, 8:00 - 16:00</p>
        </div>
    </body>
    </html>
  `);
  };
  registerAdultStudent = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const data = req.body as RegisterAdultStudentRequestDTO;

      if (
        !data.email ||
        !data.password ||
        !data.name ||
        !data.semester ||
        !data.state
      ) {
        res.status(400).json({
          message:
            "Email, contraseña, nombre, semestre y estado son requeridos",
        });
        return;
      }

      const result = await this.registerAdultStudentUseCase.execute(data);

      const response: AuthResponseDTO = {
        user: {
          id: result.student.id,
          email: result.student.email,
          name: result.student.name,
          userType: "student",
          createdAt: result.student.createdAt,
        },
        token: result.token,
      };

      res.status(201).json(response);
    } catch (error) {
      next(error);
    }
  };

  registerTutor = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const data = req.body as RegisterTutorRequestDTO;

      if (!data.email || !data.password || !data.name || !data.phone) {
        res.status(400).json({
          message: "Email, contraseña, nombre y teléfono son requeridos",
        });
        return;
      }

      const result = await this.registerTutorUseCase.execute(data);

      const response: TutorResponseDTO = {
        tutor: {
          id: result.tutor.id,
          email: result.tutor.email,
          name: result.tutor.name,
          phone: result.tutor.phone,
          createdAt: result.tutor.createdAt,
        },
        token: result.token,
      };

      res.status(201).json(response);
    } catch (error) {
      next(error);
    }
  };

  registerMinorStudent = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const data = req.body as RegisterMinorStudentRequestDTO;

      const requiredFields = [
        "email",
        "name",
        "semester",
        "state",
        "birthdate",
        "relationship",
        "tutorId",
      ];

      const missingFields = requiredFields.filter(
        (field) => !data[field as keyof RegisterMinorStudentRequestDTO]
      );

      if (missingFields.length > 0) {
        res.status(400).json({
          message: `Campos requeridos faltantes: ${missingFields.join(", ")}`,
        });
        return;
      }

      const result = await this.registerMinorStudentUseCase.execute(data);

      const response: StudentResponseDTO = {
        student: {
          id: result.student.id,
          email: result.student.email,
          name: result.student.name,
          semester: result.student.semester,
          state: result.student.state,
          tutorId: result.student.tutorId,
          createdAt: result.student.createdAt,
        },
      };

      res.status(201).json(response);
    } catch (error) {
      next(error);
    }
  };

  deleteTutor = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      // Tipado de req.body con el DTO existente (o una interfaz para DELETE)
      const { email, password } = req.body as LoginRequestDTO;

      if (!email || !password) {
        // Usar next para que el manejador global procese el 400
        return next(
          new MissingFieldsError("some fields are missing", "email", "password")
        );
      }

      await this.deleteTutorUseCase.run(email, password);

      res.status(200).json({
        success: true,
        message: "tutor has been successfully removed",
      });
    } catch (error) {
      next(error); // Captura errores del Caso de Uso (ej: InvalidCredentialsError)
    }
  };

  deleteStudent = async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Tipado de req.body con el DTO existente (o una interfaz para DELETE)
      const { email, password } = req.body as LoginRequestDTO;

      if (!email || !password) {
        // Usar next para que el manejador global procese el 400
        return next(
          new MissingFieldsError("some fields are missing", "email", "password")
        );
      }

      await this.deleteStudentUseCase.run(email, password);

      res.status(200).json({
        success: true,
        message: "student has been successfully removed",
      });
    } catch (error) {
      next(error); // Captura errores del Caso de Uso (ej: InvalidCredentialsError)
    }
  };
}
