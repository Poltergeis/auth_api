<<<<<<< HEAD
import { Tutor } from './Tutor';
import { Student } from './Student';
=======
import { User } from './User';
>>>>>>> 91a7de5e02ba36c4c25d5f60947fc719d2c35bde

export interface AuthService {
  hashPassword(password: string): Promise<string>;
  comparePassword(password: string, hash: string): Promise<boolean>;
<<<<<<< HEAD
  generateToken(user: Tutor | Student, userType: 'tutor' | 'student'): string;
  verifyToken(token: string): { userId: string; userType: 'tutor' | 'student' };
=======
  generateToken(user: User): string;
  verifyToken(token: string): string; // Retorna el ID de usuario
>>>>>>> 91a7de5e02ba36c4c25d5f60947fc719d2c35bde
}