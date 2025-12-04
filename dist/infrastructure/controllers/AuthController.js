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
exports.AuthController = void 0;
class AuthController {
    constructor(loginUseCase, registerAdultUseCase, registerTutorUseCase) {
        this.loginUseCase = loginUseCase;
        this.registerAdultUseCase = registerAdultUseCase;
        this.registerTutorUseCase = registerTutorUseCase;
        this.login = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, password } = req.body;
                if (!email || !password) {
                    res.status(400).json({ message: 'Email y contraseña son requeridos' });
                    return;
                }
                const result = yield this.loginUseCase.login(email, password);
                const response = {
                    user: {
                        id: result.user.id,
                        email: result.user.email,
                        name: result.user.name,
                        isTutor: result.user.isTutor,
                        createdAt: result.user.createdAt
                    },
                    token: result.token
                };
                res.status(200).json(response);
            }
            catch (error) {
                next(error);
            }
        });
        this.registerAdult = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const data = req.body;
                if (!data.email || !data.password || !data.name) {
                    res.status(400).json({ message: 'Email, contraseña y nombre son requeridos' });
                    return;
                }
                const result = yield this.registerAdultUseCase.registerAdult(Object.assign(Object.assign({}, data), { isTutor: false }));
                const response = {
                    user: {
                        id: result.user.id,
                        email: result.user.email,
                        name: result.user.name,
                        isTutor: result.user.isTutor,
                        createdAt: result.user.createdAt
                    },
                    token: result.token
                };
                res.status(201).json(response);
            }
            catch (error) {
                next(error);
            }
        });
        this.registerTutor = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const data = req.body;
                const requiredFields = [
                    'email', 'password', 'name', 'phone', 'relationship',
                    'minorName', 'minorEmail', 'minorBirthdate', 'minorSemester', 'minorState'
                ];
                const missingFields = requiredFields.filter(field => !data[field]);
                if (missingFields.length > 0) {
                    res.status(400).json({
                        message: `Campos requeridos faltantes: ${missingFields.join(', ')}`
                    });
                    return;
                }
                const result = yield this.registerTutorUseCase.registerTutor(Object.assign(Object.assign({}, data), { isTutor: true }));
                const response = {
                    user: {
                        id: result.user.id,
                        email: result.user.email,
                        name: result.user.name,
                        isTutor: result.user.isTutor,
                        createdAt: result.user.createdAt
                    },
                    token: result.token
                };
                res.status(201).json(response);
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.AuthController = AuthController;
