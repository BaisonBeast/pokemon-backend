import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import User from '../models/userModel';
import express from 'express';
import { v4 as uuid } from 'uuid';

const router = express.Router();

interface SignupRequestBody {
    username: string;
    password: string;
    role: string;
}

interface LoginRequestBody {
    username: string;
    password: string;
}

interface UserData {
    userId: string;
    username: string;
    role: string;
}

interface ErrorResponse {
    message: string;
}

interface SignupSuccessResponse {
    userData: UserData;
}

interface LoginSuccessResponse {
    userData: UserData;
}

router.post('/signup', async (req: Request<{}, {}, SignupRequestBody>, res: Response<SignupSuccessResponse | ErrorResponse>) => {
    try {
        const { username, password, role } = req.body;

        if (!username || !password) {
            return res.status(400).json({ message: 'Please provide username and password' });
        }

        const existingUser = await User.findOne({ username });
        if (existingUser) { 
            return res.status(400).json({ message: 'User already exists.' });
        }

        const userId: string = uuid();
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ userId, username, password: hashedPassword, role });

        await newUser.save();
        const userData: UserData = {
            userId,
            username,
            role
        };
        res.status(200).json({ userData });
    } catch (err) {
        res.status(400).json({ message: `Something went wrong: ${err}` });
    }
});

router.post('/login', async (req: Request<{}, {}, LoginRequestBody>, res: Response<LoginSuccessResponse | ErrorResponse>) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ message: 'Please provide username and password.' });
        }

        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ message: 'User not found.' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: 'Invalid password.' });
        }

        const userData: UserData = {
            userId: user.userId,
            username: username,
            role: user.role
        };
        res.status(200).json({ userData });
    } 
    catch (err) {
        res.status(400).json({ message: `Something went wrong: ${err}` });
    }
});

export default router;