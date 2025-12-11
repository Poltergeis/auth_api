import { PrismaClient } from "@prisma/client";
import { TutorRepository } from "../../domain/TutorRepository";
import { Tutor, TutorRegisterData } from "../../domain/Tutor";
import { AuthService } from "../../domain/AuthService";
import { InvalidCredentialsError } from "../../domain/Errors";
import { StudentRepository } from "../../domain/StudentRepository";

export class PrismaTutorRepository implements TutorRepository {
  constructor(
    private readonly prisma: PrismaClient,
    private readonly authService: AuthService
  ) {}

  async delete(email: string, password: string): Promise<void> {
    const self = await this.findByEmail(email);

    if (!self) {
      throw new InvalidCredentialsError(); // Tutor no encontrado.
    }

    // 1. Verificar la contraseña (Corregido)
    const isPasswordValid = await this.authService.comparePassword(
      password,
      self.passwordHash
    );
    if (!isPasswordValid) {
      throw new InvalidCredentialsError();
    }

    // 2. Realizar las eliminaciones dentro de una transacción
    await this.prisma.$transaction([
      // Eliminar estudiantes asociados (si existen, prisma.deleteMany lo maneja)
      this.prisma.student.deleteMany({
        where: { tutorId: self.id },
      }),

      // Eliminar el tutor
      this.prisma.tutor.delete({
        where: { id: self.id },
      }),
    ]);
    // La transacción garantiza que, si cualquiera falla, todas se revierten.
  }

  async findByEmail(email: string): Promise<Tutor | null> {
    const tutor = await this.prisma.tutor.findUnique({
      where: { email },
    });
    return tutor ? this.toDomain(tutor) : null;
  }

  async findById(id: string): Promise<Tutor | null> {
    const tutor = await this.prisma.tutor.findUnique({
      where: { id },
    });
    return tutor ? this.toDomain(tutor) : null;
  }

  async save(data: TutorRegisterData): Promise<Tutor> {
    const tutor = await this.prisma.tutor.create({
      data: {
        email: data.email,
        name: data.name,
        passwordHash: data.password,
        phone: data.phone,
      },
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
        phone: tutor.phone,
      },
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
      createdAt: prismaTutor.createdAt,
    };
  }
}
