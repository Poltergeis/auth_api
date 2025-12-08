import { AuthService } from '../domain/AuthService';
import { UserAlreadyExistsError, TutorNotFoundError } from '../domain/Errors';
import { MinorStudentRegisterData, Student } from '../domain/Student';
import { StudentRepository } from '../domain/StudentRepository';
import { TutorRepository } from '../domain/TutorRepository';

export class RegisterMinorStudentUseCase {
  constructor(
    private readonly studentRepository: StudentRepository,
    private readonly tutorRepository: TutorRepository
  ) {}

  async execute(data: MinorStudentRegisterData): Promise<{
    student: Student;
  }> {
    // Validar que el tutor exista
    const tutor = await this.tutorRepository.findById(data.tutorId);
    if (!tutor) {
      throw new TutorNotFoundError('El tutor especificado no existe.');
    }

    // Validar que el email del estudiante no exista
    const existingStudent = await this.studentRepository.findByEmail(data.email);
    if (existingStudent) {
      throw new UserAlreadyExistsError('El email ya está registrado.');
    }

    const student = await this.studentRepository.saveMinor(data);
    return { student };
  }
}