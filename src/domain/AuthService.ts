import { Tutor } from './Tutor';
import { Student } from './Student';

export interface AuthService {
  hashPassword(password: string): Promise<string>;
  comparePassword(password: string, hash: string): Promise<boolean>;
  generateToken(user: Tutor | Student, userType: 'tutor' | 'student'): string;
  verifyToken(token: string): { userId: string; userType: 'tutor' | 'student' };
}