import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import userRouter from './routes/user.routes';
dotenv.config();

const app = express();

const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use("/api/v1/users", userRouter);

app.get("/", (req, res) => {
    res.status(200).json({
        message: "Welcome to the backend server!",
    });
})

app.listen(PORT, ()=>{
    console.log(`Server is running on port ${PORT}`);
})