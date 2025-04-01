import { Router } from 'express'
const router = Router() ;
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient() ;


router.get("/", function (req, res){
    res.send("hello");
})
// Authentication
// POST /api/signup
router.post("/signup",async (req, res) => {
    const email = req.body.email ;
    const password = req.body.password ;

    const existingUser = prisma.user.findFirst({
        where: email
    })

   

})

export default router;
// POST /api/login

// // Projects
// GET /api/projects
// POST /api/projects 
// DELETE /api/projects/:id

// // Tasks 
// POST /api/tasks
// PATCH /api/tasks/:id (toggle complete)
// DELETE /api/tasks/:id
