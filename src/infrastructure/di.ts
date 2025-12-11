import { PrismaClient } from '@prisma/client';
import { LoginUseCase } from '../application/LoginUseCase';
import { RegisterAdultStudentUseCase } from '../application/RegisterAdultStudentUseCase';
import { RegisterTutorUseCase } from '../application/RegisterTutorUseCase';
import { RegisterMinorStudentUseCase } from '../application/RegisterMinorStudentUseCase';
import { PrismaTutorRepository } from './repositories/PrismaTutorRepository';
import { PrismaStudentRepository } from './repositories/PrismaStudentRepository';
import { JWTAuthService } from './auth-service.impl';
import { AuthController } from './controllers/AuthController';
import DeleteStudentUseCase from '../application/DeleteStudentUseCase';
import DeleteTutorUseCase from '../application/DeleteTutorUseCase';

export class DependencyContainer {
  private static instance: DependencyContainer;

  public readonly prisma: PrismaClient;
  public readonly tutorRepository: PrismaTutorRepository;
  public readonly studentRepository: PrismaStudentRepository;
  public readonly authService: JWTAuthService;
  public readonly loginUseCase: LoginUseCase;
  public readonly registerAdultStudentUseCase: RegisterAdultStudentUseCase;
  public readonly registerTutorUseCase: RegisterTutorUseCase;
  public readonly registerMinorStudentUseCase: RegisterMinorStudentUseCase;
  public readonly authController: AuthController;
  public readonly deleteStudentUseCase: DeleteStudentUseCase;
  public readonly deleteTutorUseCase: DeleteTutorUseCase;

  private constructor() {
    // Infraestructura
    this.prisma = new PrismaClient();
    this.authService = new JWTAuthService(
      process.env.JWT_SECRET || 'default-secret-change-in-production'
    );
    this.tutorRepository = new PrismaTutorRepository(this.prisma, this.authService);
    this.studentRepository = new PrismaStudentRepository(this.prisma, this.authService);

    // Casos de uso
    this.loginUseCase = new LoginUseCase(
      this.tutorRepository,
      this.studentRepository,
      this.authService
    );
    this.registerAdultStudentUseCase = new RegisterAdultStudentUseCase(
      this.studentRepository,
      this.authService
    );
    this.registerTutorUseCase = new RegisterTutorUseCase(
      this.tutorRepository,
      this.authService
    );
    this.registerMinorStudentUseCase = new RegisterMinorStudentUseCase(
      this.studentRepository,
      this.tutorRepository
    );

    this.deleteStudentUseCase = new DeleteStudentUseCase(this.studentRepository);
    this.deleteTutorUseCase = new DeleteTutorUseCase(this.tutorRepository);

    // Controladores
    this.authController = new AuthController(
      this.loginUseCase,
      this.registerAdultStudentUseCase,
      this.registerTutorUseCase,
      this.registerMinorStudentUseCase,
      this.deleteTutorUseCase,
      this.deleteStudentUseCase
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