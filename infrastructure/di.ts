import { PrismaClient } from '@prisma/client';
import { PrismaUserRepository } from './repository';
import { JWTAuthService } from './auth-service.impl';
import { LoginUseCase } from '../application/login.use-case';
import { RegisterAdult } from '../application/register-adult.use-case';
import { RegisterTutor } from '../application/register-tutor.use-case';
import { AuthController } from './controllers/AuthController';

export class DependencyContainer {
  private static instance: DependencyContainer;
  
  public readonly prisma: PrismaClient;
  public readonly userRepository: PrismaUserRepository;
  public readonly authService: JWTAuthService;
  public readonly loginUseCase: LoginUseCase;
  public readonly registerAdultUseCase: RegisterAdult;
  public readonly registerTutorUseCase: RegisterTutor;
  public readonly authController: AuthController;

  private constructor() {
    // Infraestructura
    this.prisma = new PrismaClient({});
    this.userRepository = new PrismaUserRepository(this.prisma);
    this.authService = new JWTAuthService(process.env.JWT_SECRET || 'default-secret-change-in-production');

    // Casos de uso
    this.loginUseCase = new LoginUseCase(this.userRepository, this.authService);
    this.registerAdultUseCase = new RegisterAdult(this.userRepository, this.authService);
    this.registerTutorUseCase = new RegisterTutor(this.userRepository, this.authService);

    // Controladores
    this.authController = new AuthController(
      this.loginUseCase,
      this.registerAdultUseCase,
      this.registerTutorUseCase
    );
  }

  public static getInstance(): DependencyContainer {
    if (!DependencyContainer.instance) {
      DependencyContainer.instance = new DependencyContainer();
    }
    return DependencyContainer.instance;
  }

  public async disconnect(): Promise<void> {
    await this.prisma.$disconnect();
  }
}