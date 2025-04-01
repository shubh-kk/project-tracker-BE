import { Router } from 'express'
const router = Router() ;
import bcrypt from 'bcrypt' ;
import jwt from "jsonwebtoken";
import { PrismaClient } from '@prisma/client';
import 'dotenv/config'
const prisma = new PrismaClient() ;


const saltRounds = 5 ;
async function makeHashedpassword(password: any){
    return await bcrypt.hash(password, saltRounds)
}

router.get("/", function (req, res){
    res.send("hello");
})

// POST /api/signup
router.post("/signup",async (req, res) => {
    const email = req.body.email ;
    const password = req.body.password ;


    const existingUser = prisma.user.findFirst({
        where: email
    })

    try {
        const user = await prisma.user.create({
            data: {
              email,
              password: await makeHashedpassword(password)
            }
        })
        
        const token = jwt.sign(email, process.env.JWT_SECRET!) ;

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

export default router;

