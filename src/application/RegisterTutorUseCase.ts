import { AuthService } from '../domain/AuthService';
import { UserAlreadyExistsError } from '../domain/Errors';
import { TutorRegisterData, Tutor } from '../domain/Tutor';
import { TutorRepository } from '../domain/TutorRepository';

export class RegisterTutorUseCase {
  constructor(
    private readonly tutorRepository: TutorRepository,
    private readonly authService: AuthService
  ) {}

  async execute(data: TutorRegisterData): Promise<{
    tutor: Tutor;
    token: string;
  }> {
    const existingTutor = await this.tutorRepository.findByEmail(data.email);
    if (existingTutor) {
      throw new UserAlreadyExistsError('El email del tutor ya está registrado.');
    }

    const hashedPassword = await this.authService.hashPassword(data.password);
    const tutor = await this.tutorRepository.save({
      ...data,
      password: hashedPassword
    });

    const token = this.authService.generateToken(tutor, 'tutor');
    return { tutor, token };
  }
}