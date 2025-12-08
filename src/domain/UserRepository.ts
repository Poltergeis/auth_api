import { User, RegisterData, TutorRegisterData } from './User';

export interface UserRepository {
  findByEmail(email: string): Promise<User | null>;
  save(userData: RegisterData | TutorRegisterData): Promise<User>;
  update(user: User): Promise<User>;
}