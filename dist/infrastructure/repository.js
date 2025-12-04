"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaUserRepository = void 0;
class PrismaUserRepository {
    constructor(prisma) {
        this.prisma = prisma;
    }
    findByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.prisma.user.findUnique({
                where: { email }
            });
            return user ? this.toDomain(user) : null;
        });
    }
    save(userData) {
        return __awaiter(this, void 0, void 0, function* () {
            const isTutorData = (data) => {
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
            const user = yield this.prisma.user.create({
                data: dataToSave
            });
            return this.toDomain(user);
        });
    }
    update(user) {
        return __awaiter(this, void 0, void 0, function* () {
            const updated = yield this.prisma.user.update({
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
        });
    }
    toDomain(prismaUser) {
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
exports.PrismaUserRepository = PrismaUserRepository;
