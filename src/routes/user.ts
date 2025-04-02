import { Request, Response, Router } from 'express'
import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";
import { PrismaClient } from '@prisma/client';
import 'dotenv/config'

const router = Router();
const prisma = new PrismaClient();

const saltRounds = 5;
const JWT_SECRET = process.env.JWT_SECRET;;

async function makeHashedpassword(password: string): Promise<string> {
    return await bcrypt.hash(password, saltRounds)
}

// POST /api/signup
router.post("/signup", async (req: Request, res: Response) => {
    const email = req.body.email;
    const password = req.body.password;

    // if JWT_SECRET is loaded
    if (!JWT_SECRET) {
        console.error("JWT_SECRET is not defined in environment variables.");
        res.status(500).json({ msg: "Server configuration error." });
        return;
    }

    try {
        const user = await prisma.user.create({
            data: {
                email,
                password: await makeHashedpassword(password)
            }
        })

        const token = jwt.sign({ userId: user.id }, JWT_SECRET);

        res.status(201).json({
            msg: "Signup Success!!",
            token
        })
    } catch (error) {
        res.status(400).json({
            msg: "Signup Failed!!",
            error
        })
    }
})

router.post("/signin", async (req: Request, res: Response): Promise<any> => {
    const { email, password } = req.body;
    // const { token } = req.headers.authorization ;

    // if JWT_SECRET is loaded
    if (!JWT_SECRET) {
        console.error("JWT_SECRET is not defined in environment variables.");
        res.status(500).json({ msg: "Server configuration error." });
        return;
    }

    try {
        const user = await prisma.user.findUnique({
            where: { email }
        })

        if (!user) {
            return res.status(401).json({ msg: "Invalid email or password." });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({ msg: "Invalid email or password." });
        }

        const token = jwt.sign({ userId: user.id }, JWT_SECRET);
        res.status(200).json({
            msg: "Signin successful!",
            token: token,
            userId: user.id
        });

    } catch (error) {
        res.status(400).json({
            msg: "Signup Failed!!",
            error
        })
    }
})
export default router;

