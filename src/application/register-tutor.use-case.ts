import { AuthService } from "../domain/AuthService";
import { InvalidCredentialsError, UserAlreadyExistsError } from "../domain/Errors";
import { RegisterData, TutorRegisterData, User } from "../domain/User";
import { UserRepository } from "../domain/UserRepository";

export class RegisterTutor {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly securityService: AuthService // Inyección de dependencia
  ) { }

  async registerTutor(data: TutorRegisterData): Promise<{ user: User, token: string }> {
    // Validaciones de email para tutor y menor
    const existingTutor = await this.userRepository.findByEmail(data.email);
    if (existingTutor) {
      throw new UserAlreadyExistsError('El email del tutor ya está registrado.');
    }

    const existingMinor = await this.userRepository.findByEmail(data.minorEmail);
    if (existingMinor) {
       // Opcional: manejar si el email del menor ya existe
       throw new UserAlreadyExistsError('El email del menor ya está registrado con otra cuenta.');
    }

    // Hash de la contraseña
    data.password = await this.securityService.hashPassword(data.password);

    // Guardar el registro completo del tutor y el menor asociado (revisa tu modelo Prisma)
    const newTutorUser = await this.userRepository.save({ ...data, isTutor: true });

    const token = this.securityService.generateToken(newTutorUser);
    return { user: newTutorUser, token };
  }
}