import { Router } from "express";
import { PrismaClient } from "../generated/prisma";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const userRouter = Router();
const prisma = new PrismaClient();

//@ts-ignore
userRouter.post("/register", async (req , res) => {
    const { company_name, company_address, company_phone, company_website, password} = req.body;

    if( !company_name || !company_address || !company_phone || !company_website || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }

    try{
        const existingUser = await prisma.user.findFirst({
            where: {company_website: company_website}
        });

        if(existingUser){
            return res.status(400).json(
                {message: "Company with this email already exists"}
            )
        }

       
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = await prisma.user.create({
            data : {
                company_name,
                company_address,
                company_phone,
                company_website,
                password : hashedPassword, 
            }


        })

        return res.status(200).json({
            message : "Company registered successfully!"
        })
    }
    catch (error) {
        console.error("Error registering user:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
})

//@ts-ignore
userRouter.post("/login", async (req, res) => {
    const { company_name, company_website, password} = req.body;
    if (!company_name || !company_website || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }

    try{
        const user = await prisma.user.findFirst({
            where: {company_website: company_website}
        })

        if(!user){
            return res.status(400).json({
                message : "Company with this email does not exist"
            })
        }

        
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if(!isPasswordValid) {
            return res.status(400).json({ message: "Invalid password" });
        }

    
        const token = jwt.sign(
            { 
                userId: user.id, 
                company_name: user.company_name,
                company_website: user.company_website 
            },
            process.env.JWT_SECRET || "your-secret-key",
            { expiresIn: "1d" }
        );

        console.log("Generated JWT token:", token);
        

       
        res.cookie("authToken", token, {
            httpOnly: true,    
            secure: process.env.NODE_ENV === "production", 
            sameSite: "strict", 
            maxAge: 1 * 24 * 60 * 60 * 1000 
        });

        
        return res.status(200).json({
            message : "Login successful",
            user: {company_name: user.company_name, 
                  company_address: user.company_address, 
                  company_phone: user.company_phone, 
                  company_website: user.company_website}
        })

    } catch (error) {
        console.error("Error logging in user:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
})

//@ts-ignore
userRouter.get("/logout", async (req, res) => {
    try{
      
        res.clearCookie("authToken");
        return res.status(200).json({ message: "Logout successful" });
    }
    catch (error) {
        console.error("Error logging out user:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
})

//@ts-ignore
userRouter.post("/delete", async (req, res) => {
    try{
        const { company_website } = req.body;
        const user = await prisma.user.delete({
            where: { company_website: company_website }
        });
        return res.status(200).json({
            message: "User deleted successfully",
         
        });
    } catch (error) {
        console.error("Error deleting user:", error);
        return res.status(500).json({ message: "Internal server error" });
    }    
})

export default userRouter;