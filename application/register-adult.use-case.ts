import { AuthService } from "../domain/AuthService";
import { InvalidCredentialsError, UserAlreadyExistsError } from "../domain/Errors";
import { RegisterData, User } from "../domain/User";
import { UserRepository } from "../domain/UserRepository";

export class RegisterAdult {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly securityService: AuthService // Inyección de dependencia
  ) { }
 
  async registerAdult(data: RegisterData): Promise<{ user: User, token: string }> {
    const existingUser = await this.userRepository.findByEmail(data.email);
    if (existingUser) {
      throw new UserAlreadyExistsError('El email ya está registrado.');
    }

    // Hash de la contraseña antes de guardar
    data.password = await this.securityService.hashPassword(data.password);

    const newUser = await this.userRepository.save({ ...data, isTutor: false });

    const token = this.securityService.generateToken(newUser);
    return { user: newUser, token };
  }
}