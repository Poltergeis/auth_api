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
exports.LoginUseCase = void 0;
const Errors_1 = require("../domain/Errors");
class LoginUseCase {
    constructor(userRepository, securityService // Inyección de dependencia
    ) {
        this.userRepository = userRepository;
        this.securityService = securityService;
    }
    login(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.userRepository.findByEmail(email);
            if (!user) {
                throw new Errors_1.InvalidCredentialsError('Email o contraseña incorrectos.');
            }
            const isPasswordValid = yield this.securityService.comparePassword(password, user.passwordHash);
            if (!isPasswordValid) {
                throw new Errors_1.InvalidCredentialsError('Email o contraseña incorrectos.');
            }
            // Generar Token JWT para la sesión
            const token = this.securityService.generateToken(user);
            return { user, token };
        });
    }
}
exports.LoginUseCase = LoginUseCase;
