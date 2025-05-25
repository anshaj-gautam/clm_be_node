"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userRouter = (0, express_1.Router)();
userRouter.get("/test", (req, res) => {
    res.status(200).json({
        message: "Welcome to the user route!",
    });
});
exports.default = userRouter;
