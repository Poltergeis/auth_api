import { AuthService } from '../domain/AuthService';
import { UserAlreadyExistsError } from '../domain/Errors';
import { AdultStudentRegisterData, Student } from '../domain/Student';
import { StudentRepository } from '../domain/StudentRepository';

export class RegisterAdultStudentUseCase {
  constructor(
    private readonly studentRepository: StudentRepository,
    private readonly authService: AuthService
  ) {}

  async execute(data: AdultStudentRegisterData): Promise<{
    student: Student;
    token: string;
  }> {
    const existingStudent = await this.studentRepository.findByEmail(data.email);
    if (existingStudent) {
      throw new UserAlreadyExistsError('El email ya está registrado.');
    }

    const hashedPassword = await this.authService.hashPassword(data.password);
    const student = await this.studentRepository.saveAdult({
      ...data,
      password: hashedPassword
    });

    const token = this.authService.generateToken(student, 'student');
    return { student, token };
  }
}