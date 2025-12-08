import { PrismaClient } from '@prisma/client';
import { StudentRepository } from '../../domain/StudentRepository';
import {
  Student,
  AdultStudentRegisterData,
  MinorStudentRegisterData
} from '../../domain/Student';

export class PrismaStudentRepository implements StudentRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findByEmail(email: string): Promise<Student | null> {
    const student = await this.prisma.student.findUnique({
      where: { email }
    });
    return student ? this.toDomain(student) : null;
  }

  async findById(id: string): Promise<Student | null> {
    const student = await this.prisma.student.findUnique({
      where: { id }
    });
    return student ? this.toDomain(student) : null;
  }

  async findByTutorId(tutorId: string): Promise<Student[]> {
    const students = await this.prisma.student.findMany({
      where: { tutorId }
    });
    return students.map(s => this.toDomain(s));
  }

  async saveAdult(data: AdultStudentRegisterData): Promise<Student> {
    const student = await this.prisma.student.create({
      data: {
        email: data.email,
        name: data.name,
        passwordHash: data.password,
        semester: data.semester,
        state: data.state,
        birthdate: null,
        relationship: null,
        tutorId: null
      }
    });
    return this.toDomain(student);
  }

  async saveMinor(data: MinorStudentRegisterData): Promise<Student> {
    const student = await this.prisma.student.create({
      data: {
        email: data.email,
        name: data.name,
        passwordHash: null,
        semester: data.semester,
        state: data.state,
        birthdate: data.birthdate,
        relationship: data.relationship,
        tutorId: data.tutorId
      }
    });
    return this.toDomain(student);
  }

  async update(student: Student): Promise<Student> {
    const updated = await this.prisma.student.update({
      where: { id: student.id },
      data: {
        email: student.email,
        name: student.name,
        passwordHash: student.passwordHash,
        semester: student.semester,
        state: student.state,
        birthdate: student.birthdate,
        relationship: student.relationship,
        hasCompletedEvaluation: student.hasCompletedEvaluation,
        tutorId: student.tutorId
      }
    });
    return this.toDomain(updated);
  }

  private toDomain(prismaStudent: any): Student {
    return {
      id: prismaStudent.id,
      email: prismaStudent.email,
      name: prismaStudent.name,
      passwordHash: prismaStudent.passwordHash,
      semester: prismaStudent.semester,
      state: prismaStudent.state,
      birthdate: prismaStudent.birthdate,
      relationship: prismaStudent.relationship,
      createdAt: prismaStudent.createdAt,
      hasCompletedEvaluation: prismaStudent.hasCompletedEvaluation,
      tutorId: prismaStudent.tutorId
    };
  }
}