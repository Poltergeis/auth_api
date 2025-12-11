import { Tutor, TutorRegisterData } from './Tutor';

export interface TutorRepository {
  findByEmail(email: string): Promise<Tutor | null>;
  findById(id: string): Promise<Tutor | null>;
  save(data: TutorRegisterData): Promise<Tutor>;
  update(tutor: Tutor): Promise<Tutor>;
  delete(email:string, password: string): Promise<void>;
}