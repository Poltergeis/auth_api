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
exports.RegisterTutor = void 0;
const Errors_1 = require("../domain/Errors");
class RegisterTutor {
    constructor(userRepository, securityService // Inyección de dependencia
    ) {
        this.userRepository = userRepository;
        this.securityService = securityService;
    }
    registerTutor(data) {
        return __awaiter(this, void 0, void 0, function* () {
            // Validaciones de email para tutor y menor
            const existingTutor = yield this.userRepository.findByEmail(data.email);
            if (existingTutor) {
                throw new Errors_1.UserAlreadyExistsError('El email del tutor ya está registrado.');
            }
            const existingMinor = yield this.userRepository.findByEmail(data.minorEmail);
            if (existingMinor) {
                // Opcional: manejar si el email del menor ya existe
                throw new Errors_1.UserAlreadyExistsError('El email del menor ya está registrado con otra cuenta.');
            }
            // Hash de la contraseña
            data.password = yield this.securityService.hashPassword(data.password);
            // Guardar el registro completo del tutor y el menor asociado (revisa tu modelo Prisma)
            const newTutorUser = yield this.userRepository.save(Object.assign(Object.assign({}, data), { isTutor: true }));
            const token = this.securityService.generateToken(newTutorUser);
            return { user: newTutorUser, token };
        });
    }
}
exports.RegisterTutor = RegisterTutor;
