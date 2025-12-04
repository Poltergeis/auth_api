import { Request, Response, NextFunction } from 'express';
import { 
  LoginRequestDTO, 
  RegisterAdultRequestDTO, 
  RegisterTutorRequestDTO,
  AuthResponseDTO 
} from '../models/http/DTOs';
import { LoginUseCase } from '../../application/login.use-case';
import { RegisterAdult } from '../../application/register-adult.use-case';
import { RegisterTutor } from '../../application/register-tutor.use-case';

export class AuthController {
  constructor(
    private readonly loginUseCase: LoginUseCase,
    private readonly registerAdultUseCase: RegisterAdult,
    private readonly registerTutorUseCase: RegisterTutor
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
          isTutor: result.user.isTutor,
          createdAt: result.user.createdAt
        },
        token: result.token
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  };

  registerAdult = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const data = req.body as RegisterAdultRequestDTO;

      if (!data.email || !data.password || !data.name) {
        res.status(400).json({ message: 'Email, contraseña y nombre son requeridos' });
        return;
      }

      const result = await this.registerAdultUseCase.registerAdult({
        ...data,
        isTutor: false
      });

      const response: AuthResponseDTO = {
        user: {
          id: result.user.id,
          email: result.user.email,
          name: result.user.name,
          isTutor: result.user.isTutor,
          createdAt: result.user.createdAt
        },
        token: result.token
      };

      res.status(201).json(response);
    } catch (error) {
      next(error);
    }
  };

  registerTutor = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const data = req.body as RegisterTutorRequestDTO;

      const requiredFields = [
        'email', 'password', 'name', 'phone', 'relationship',
        'minorName', 'minorEmail', 'minorBirthdate', 'minorSemester', 'minorState'
      ];

      const missingFields = requiredFields.filter(field => !data[field as keyof RegisterTutorRequestDTO]);
      
      if (missingFields.length > 0) {
        res.status(400).json({ 
          message: `Campos requeridos faltantes: ${missingFields.join(', ')}` 
        });
        return;
      }

      const result = await this.registerTutorUseCase.registerTutor({
        ...data,
        isTutor: true
      });

      const response: AuthResponseDTO = {
        user: {
          id: result.user.id,
          email: result.user.email,
          name: result.user.name,
          isTutor: result.user.isTutor,
          createdAt: result.user.createdAt
        },
        token: result.token
      };

      res.status(201).json(response);
    } catch (error) {
      next(error);
    }
  };
}