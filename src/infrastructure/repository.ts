import { PrismaClient } from '@prisma/client';
import { UserRepository } from '../domain/UserRepository';
import { User, RegisterData, TutorRegisterData } from '../domain/User';

export class PrismaUserRepository implements UserRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { email }
    });
    
    return user ? this.toDomain(user) : null;
  }

  async save(userData: RegisterData | TutorRegisterData): Promise<User> {
    const isTutorData = (data: RegisterData | TutorRegisterData): data is TutorRegisterData => {
      return data.isTutor === true;
    };

    const dataToSave = isTutorData(userData) ? {
      email: userData.email,
      name: userData.name,
      passwordHash: userData.password, // Ya viene hasheada desde el use case
      isTutor: true,
      phone: userData.phone,
      relationship: userData.relationship,
      minorName: userData.minorName,
      minorEmail: userData.minorEmail,
      minorBirthdate: userData.minorBirthdate,
      semester: userData.minorSemester,
      state: userData.minorState,
    } : {
      email: userData.email,
      name: userData.name,
      passwordHash: userData.password,
      isTutor: false,
      semester: userData.semester,
      state: userData.state,
    };

    const user = await this.prisma.user.create({
      data: dataToSave
    });

    return this.toDomain(user);
  }

  async update(user: User): Promise<User> {
    const updated = await this.prisma.user.update({
      where: { id: user.id },
      data: {
        email: user.email,
        name: user.name,
        passwordHash: user.passwordHash,
        semester: user.semester,
        state: user.state,
        hasCompletedEvaluation: user.hasCompletedEvaluation,
        isTutor: user.isTutor,
        phone: user.phone,
        relationship: user.relationship,
        minorName: user.minorName,
        minorEmail: user.minorEmail,
        minorBirthdate: user.minorBirthdate,
      }
    });

    return this.toDomain(updated);
  }

  private toDomain(prismaUser: any): User {
    return {
      id: prismaUser.id,
      email: prismaUser.email,
      name: prismaUser.name,
      passwordHash: prismaUser.passwordHash,
      semester: prismaUser.semester,
      state: prismaUser.state,
      createdAt: prismaUser.createdAt,
      hasCompletedEvaluation: prismaUser.hasCompletedEvaluation,
      isTutor: prismaUser.isTutor,
      phone: prismaUser.phone,
      relationship: prismaUser.relationship,
      minorName: prismaUser.minorName,
      minorEmail: prismaUser.minorEmail,
      minorBirthdate: prismaUser.minorBirthdate,
    };
  }
}