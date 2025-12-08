import { PrismaClient } from '@prisma/client';
import { TutorRepository } from '../../domain/TutorRepository';
import { Tutor, TutorRegisterData } from '../../domain/Tutor';

export class PrismaTutorRepository implements TutorRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findByEmail(email: string): Promise<Tutor | null> {
    const tutor = await this.prisma.tutor.findUnique({
      where: { email }
    });
    return tutor ? this.toDomain(tutor) : null;
  }

  async findById(id: string): Promise<Tutor | null> {
    const tutor = await this.prisma.tutor.findUnique({
      where: { id }
    });
    return tutor ? this.toDomain(tutor) : null;
  }

  async save(data: TutorRegisterData): Promise<Tutor> {
    const tutor = await this.prisma.tutor.create({
      data: {
        email: data.email,
        name: data.name,
        passwordHash: data.password,
        phone: data.phone
      }
    });
    return this.toDomain(tutor);
  }

  async update(tutor: Tutor): Promise<Tutor> {
    const updated = await this.prisma.tutor.update({
      where: { id: tutor.id },
      data: {
        email: tutor.email,
        name: tutor.name,
        passwordHash: tutor.passwordHash,
        phone: tutor.phone
      }
    });
    return this.toDomain(updated);
  }

  private toDomain(prismaTutor: any): Tutor {
    return {
      id: prismaTutor.id,
      email: prismaTutor.email,
      name: prismaTutor.name,
      passwordHash: prismaTutor.passwordHash,
      phone: prismaTutor.phone,
      createdAt: prismaTutor.createdAt
    };
  }
}