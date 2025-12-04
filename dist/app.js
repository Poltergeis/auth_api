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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const di_1 = require("./infrastructure/di");
const Errors_1 = require("./domain/Errors");
const router_1 = require("./infrastructure/router");
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
// Middlewares
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Dependency Injection
const container = di_1.DependencyContainer.getInstance();
// Routes
app.use('/api', (0, router_1.createRouter)(container.authController));
// Health check
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});
// Global Error Handler
app.use((err, req, res, next) => {
    console.error('Error:', err);
    if (err instanceof Errors_1.InvalidCredentialsError) {
        res.status(401).json({ message: err.message });
        return;
    }
    if (err instanceof Errors_1.UserAlreadyExistsError) {
        res.status(409).json({ message: err.message });
        return;
    }
    if (err.message === 'Token inválido o expirado') {
        res.status(401).json({ message: err.message });
        return;
    }
    // Error genérico
    res.status(500).json(Object.assign({ message: 'Ha ocurrido un error interno del servidor' }, (process.env.NODE_ENV === 'development' && { error: err.message })));
});
// 404 Handler
app.use((req, res) => {
    res.status(404).json({ message: 'Ruta no encontrada' });
});
// Start server
app.listen(PORT, () => __awaiter(void 0, void 0, void 0, function* () {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
    console.log(`📊 Health check: http://localhost:${PORT}/health`);
}));
// Graceful shutdown
process.on('SIGINT', () => __awaiter(void 0, void 0, void 0, function* () {
    console.log('\n🛑 Cerrando servidor...');
    yield container.disconnect();
    process.exit(0);
}));
process.on('SIGTERM', () => __awaiter(void 0, void 0, void 0, function* () {
    console.log('\n🛑 Cerrando servidor...');
    yield container.disconnect();
    process.exit(0);
}));
