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
const express_1 = require("express");
const prisma_1 = require("../generated/prisma");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const userRouter = (0, express_1.Router)();
const prisma = new prisma_1.PrismaClient();
//@ts-ignore
userRouter.post("/register", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { company_name, company_address, company_phone, company_website, password } = req.body;
    if (!company_name || !company_address || !company_phone || !company_website || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }
    try {
        const existingUser = yield prisma.user.findFirst({
            where: { company_website: company_website }
        });
        if (existingUser) {
            return res.status(400).json({ message: "Company with this email already exists" });
        }
        const salt = yield bcrypt_1.default.genSalt(10);
        const hashedPassword = yield bcrypt_1.default.hash(password, salt);
        const newUser = yield prisma.user.create({
            data: {
                company_name,
                company_address,
                company_phone,
                company_website,
                password: hashedPassword,
            }
        });
        return res.status(200).json({
            message: "Company registered successfully!"
        });
    }
    catch (error) {
        console.error("Error registering user:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}));
//@ts-ignore
userRouter.post("/login", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { company_name, company_website, password } = req.body;
    if (!company_name || !company_website || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }
    try {
        const user = yield prisma.user.findFirst({
            where: { company_website: company_website }
        });
        if (!user) {
            return res.status(400).json({
                message: "Company with this email does not exist"
            });
        }
        const isPasswordValid = yield bcrypt_1.default.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: "Invalid password" });
        }
        const token = jsonwebtoken_1.default.sign({
            userId: user.id,
            company_name: user.company_name,
            company_website: user.company_website
        }, process.env.JWT_SECRET || "your-secret-key", { expiresIn: "1d" });
        console.log("Generated JWT token:", token);
        res.cookie("authToken", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 1 * 24 * 60 * 60 * 1000
        });
        return res.status(200).json({
            message: "Login successful",
            user: { company_name: user.company_name,
                company_address: user.company_address,
                company_phone: user.company_phone,
                company_website: user.company_website }
        });
    }
    catch (error) {
        console.error("Error logging in user:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}));
//@ts-ignore
userRouter.get("/logout", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        res.clearCookie("authToken");
        return res.status(200).json({ message: "Logout successful" });
    }
    catch (error) {
        console.error("Error logging out user:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}));
//@ts-ignore
userRouter.post("/delete", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { company_website } = req.body;
        const user = yield prisma.user.delete({
            where: { company_website: company_website }
        });
        return res.status(200).json({
            message: "User deleted successfully",
        });
    }
    catch (error) {
        console.error("Error deleting user:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}));
exports.default = userRouter;
