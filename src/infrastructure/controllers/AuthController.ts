import { Request, Response, NextFunction } from 'express';
import { LoginUseCase } from '../../application/LoginUseCase';
import { RegisterAdultStudentUseCase } from '../../application/RegisterAdultStudentUseCase';
import { RegisterTutorUseCase } from '../../application/RegisterTutorUseCase';
import { RegisterMinorStudentUseCase } from '../../application/RegisterMinorStudentUseCase';
import {
  LoginRequestDTO,
  RegisterAdultStudentRequestDTO,
  RegisterTutorRequestDTO,
  RegisterMinorStudentRequestDTO,
  AuthResponseDTO,
  TutorResponseDTO,
  StudentResponseDTO
} from '../models/http/DTOs';

export class AuthController {
  constructor(
    private readonly loginUseCase: LoginUseCase,
    private readonly registerAdultStudentUseCase: RegisterAdultStudentUseCase,
    private readonly registerTutorUseCase: RegisterTutorUseCase,
    private readonly registerMinorStudentUseCase: RegisterMinorStudentUseCase
  ) {}

  login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { email, password } = req.body as LoginRequestDTO;

      if (!email || !password) {
        res.status(400).json({ message: 'Email y contraseña son requeridos' });
        return;
      }

      const result = await this.loginUseCase.login(email, password);

      const response: AuthResponseDTO = {
        user: {
          id: result.user.id,
          email: result.user.email,
          name: result.user.name,
          userType: result.userType,
          createdAt: result.user.createdAt
        },
        token: result.token
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  };

  registerAdultStudent = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const data = req.body as RegisterAdultStudentRequestDTO;

      if (!data.email || !data.password || !data.name || !data.semester || !data.state) {
        res.status(400).json({
          message: 'Email, contraseña, nombre, semestre y estado son requeridos'
        });
        return;
      }

      const result = await this.registerAdultStudentUseCase.execute(data);

      const response: AuthResponseDTO = {
        user: {
          id: result.student.id,
          email: result.student.email,
          name: result.student.name,
          userType: 'student',
          createdAt: result.student.createdAt
        },
        token: result.token
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
          message: 'Email, contraseña, nombre y teléfono son requeridos'
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
          createdAt: result.tutor.createdAt
        },
        token: result.token
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
        'email',
        'name',
        'semester',
        'state',
        'birthdate',
        'relationship',
        'tutorId'
      ];

      const missingFields = requiredFields.filter(
        field => !data[field as keyof RegisterMinorStudentRequestDTO]
      );

      if (missingFields.length > 0) {
        res.status(400).json({
          message: `Campos requeridos faltantes: ${missingFields.join(', ')}`
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
          createdAt: result.student.createdAt
        }
      };

      res.status(201).json(response);
    } catch (error) {
      next(error);
    }
  };
}