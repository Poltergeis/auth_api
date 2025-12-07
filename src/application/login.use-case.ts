import { AuthService } from "../domain/AuthService";
import { InvalidCredentialsError } from "../domain/Errors";
import { User } from "../domain/User";
import { UserRepository } from "../domain/UserRepository";

export class LoginUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly securityService: AuthService // Inyección de dependencia
  ) {}

  async login(email: string, password: string): Promise<{ user: User, token: string }> {
    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      throw new InvalidCredentialsError('Email o contraseña incorrectos.');
    }

    const isPasswordValid = await this.securityService.comparePassword(password, user.passwordHash);

    if (!isPasswordValid) {
      throw new InvalidCredentialsError('Email o contraseña incorrectos.');
    }

    // Generar Token JWT para la sesión
    const token = this.securityService.generateToken(user);

    return { user, token };
  }
}