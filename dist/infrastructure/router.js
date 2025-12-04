"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRouter = void 0;
const express_1 = require("express");
function createRouter(authController) {
    const router = (0, express_1.Router)();
    router.post('/auth/login', authController.login);
    router.post('/auth/register/adult', authController.registerAdult);
    router.post('/auth/register/tutor', authController.registerTutor);
    return router;
}
exports.createRouter = createRouter;
