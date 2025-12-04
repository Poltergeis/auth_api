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
exports.DependencyContainer = void 0;
const client_1 = require("@prisma/client");
const repository_1 = require("./repository");
const auth_service_impl_1 = require("./auth-service.impl");
const login_use_case_1 = require("../application/login.use-case");
const register_adult_use_case_1 = require("../application/register-adult.use-case");
const register_tutor_use_case_1 = require("../application/register-tutor.use-case");
const AuthController_1 = require("./controllers/AuthController");
class DependencyContainer {
    constructor() {
        // Infraestructura
        this.prisma = new client_1.PrismaClient({});
        this.userRepository = new repository_1.PrismaUserRepository(this.prisma);
        this.authService = new auth_service_impl_1.JWTAuthService(process.env.JWT_SECRET || 'default-secret-change-in-production');
        // Casos de uso
        this.loginUseCase = new login_use_case_1.LoginUseCase(this.userRepository, this.authService);
        this.registerAdultUseCase = new register_adult_use_case_1.RegisterAdult(this.userRepository, this.authService);
        this.registerTutorUseCase = new register_tutor_use_case_1.RegisterTutor(this.userRepository, this.authService);
        // Controladores
        this.authController = new AuthController_1.AuthController(this.loginUseCase, this.registerAdultUseCase, this.registerTutorUseCase);
    }
    static getInstance() {
        if (!DependencyContainer.instance) {
            DependencyContainer.instance = new DependencyContainer();
        }
        return DependencyContainer.instance;
    }
    disconnect() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.prisma.$disconnect();
        });
    }
}
exports.DependencyContainer = DependencyContainer;
