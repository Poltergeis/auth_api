import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { AuthService } from '../domain/AuthService';
import { Student, Tutor } from '@prisma/client';

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

  generateToken(user: Tutor | Student, userType: 'tutor' | 'student'): string {
    return jwt.sign(
      {
        userId: user.id,
        email: user.email,
        userType
      },
      this.jwtSecret,
      { expiresIn: '7' }
    );
  }

  verifyToken(token: string): { userId: string; userType: 'tutor' | 'student' } {
    try {
      const decoded = jwt.verify(token, this.jwtSecret) as {
        userId: string;
        userType: 'tutor' | 'student';
      };
      return { userId: decoded.userId, userType: decoded.userType };
    } catch (error) {
      throw new Error('Token inválido o expirado');
    }
  }
}