import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { AuthService } from '../domain/AuthService';
import { User } from '../domain/User';

export class JWTAuthService implements AuthService {
  private readonly jwtSecret: string;
  private readonly saltRounds: number = 10;

  constructor(jwtSecret: string) {
    this.jwtSecret = jwtSecret;
  }

  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, this.saltRounds);
  }

  async comparePassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  generateToken(user: User): string {
    return jwt.sign(
      { 
        userId: user.id, 
        email: user.email,
        isTutor: user.isTutor 
      },
      this.jwtSecret,
      { expiresIn: '7d' }
    );
  }

  verifyToken(token: string): string {
    try {
      const decoded = jwt.verify(token, this.jwtSecret) as { userId: string };
      return decoded.userId;
    } catch (error) {
      throw new Error('Token inválido o expirado');
    }
  }
}