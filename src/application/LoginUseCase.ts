import { AuthService } from '../domain/AuthService';
import { InvalidCredentialsError } from '../domain/Errors';
import { TutorRepository } from '../domain/TutorRepository';
import { StudentRepository } from '../domain/StudentRepository';

export class LoginUseCase {
  constructor(
    private readonly tutorRepository: TutorRepository,
    private readonly studentRepository: StudentRepository,
    private readonly authService: AuthService
  ) {}

  async login(email: string, password: string): Promise<{
    user: any;
    token: string;
    userType: 'tutor' | 'student';
  }> {
    // Intentar login como tutor
    const tutor = await this.tutorRepository.findByEmail(email);
    if (tutor) {
      const isPasswordValid = await this.authService.comparePassword(
        password,
        tutor.passwordHash
      );
      if (isPasswordValid) {
        const token = this.authService.generateToken(tutor, 'tutor');
        return { user: tutor, token, userType: 'tutor' };
      }
      throw new InvalidCredentialsError('Email o contraseña incorrectos.');
    }

    // Intentar login como estudiante
    const student = await this.studentRepository.findByEmail(email);
    if (!student) {
      throw new InvalidCredentialsError('Email o contraseña incorrectos.');
    }

    // Si el estudiante es mayor (tiene su propia contraseña)
    if (student.passwordHash) {
      const isPasswordValid = await this.authService.comparePassword(
        password,
        student.passwordHash
      );
      if (!isPasswordValid) {
        throw new InvalidCredentialsError('Email o contraseña incorrectos.');
      }
      const token = this.authService.generateToken(student, 'student');
      return { user: student, token, userType: 'student' };
    }

    // Si el estudiante es menor (usa la contraseña del tutor)
    if (student.tutorId) {
      const tutor = await this.tutorRepository.findById(student.tutorId);
      if (!tutor) {
        throw new InvalidCredentialsError('Error en la configuración de la cuenta.');
      }

      const isPasswordValid = await this.authService.comparePassword(
        password,
        tutor.passwordHash
      );
      if (!isPasswordValid) {
        throw new InvalidCredentialsError('Email o contraseña incorrectos.');
      }
      const token = this.authService.generateToken(student, 'student');
      return { user: student, token, userType: 'student' };
    }

    throw new InvalidCredentialsError('Email o contraseña incorrectos.');
  }
}