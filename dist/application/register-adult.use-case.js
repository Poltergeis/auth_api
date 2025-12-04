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
exports.RegisterAdult = void 0;
const Errors_1 = require("../domain/Errors");
class RegisterAdult {
    constructor(userRepository, securityService // Inyección de dependencia
    ) {
        this.userRepository = userRepository;
        this.securityService = securityService;
    }
    registerAdult(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const existingUser = yield this.userRepository.findByEmail(data.email);
            if (existingUser) {
                throw new Errors_1.UserAlreadyExistsError('El email ya está registrado.');
            }
            // Hash de la contraseña antes de guardar
            data.password = yield this.securityService.hashPassword(data.password);
            const newUser = yield this.userRepository.save(Object.assign(Object.assign({}, data), { isTutor: false }));
            const token = this.securityService.generateToken(newUser);
            return { user: newUser, token };
        });
    }
}
exports.RegisterAdult = RegisterAdult;
