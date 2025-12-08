import { Student, AdultStudentRegisterData, MinorStudentRegisterData } from './Student';

export interface StudentRepository {
  findByEmail(email: string): Promise<Student | null>;
  findById(id: string): Promise<Student | null>;
  findByTutorId(tutorId: string): Promise<Student[]>;
  saveAdult(data: AdultStudentRegisterData): Promise<Student>;
  saveMinor(data: MinorStudentRegisterData): Promise<Student>;
  update(student: Student): Promise<Student>;
}