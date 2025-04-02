import { Request, Response, Router } from 'express' ;
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient() ;
const router = Router() ;

// POST /projects -- add projects
router.post("/", async (req: Request, res: Response):Promise<any> => {
    const { title, userId } = req.body;
    // const { token } = req.headers.authorization ; //if the user has logged in or jwt


    if (!userId || !title) {
       res.status(400).json({ msg: "Provide a Project Title & userId!!" });
        return ;
    }
    
    try {
        const project = await prisma.project.create({
            data: { title, userId }
        })

        return res.status(201).json({
            msg: "Project Added Successfully!!",
            project
        })        
    } catch (error) {
        return res.status(400).json({
            msg: "Failed to add Project, Error Occured!!",
            error
        })
    }
})

// GET /projects
router.get("/all", async (req: Request, res: Response): Promise<any> => {
    const userId = req.query.userId as string;
    // const { token } = req.headers.authorization ; //if the user has logged in or jwt


    if (!userId) {
       res.status(400).json({ msg: "Provide a userId in query params!!" });
       return ;
    }

    try {
        const user = await prisma.user.findUnique({
            where: {
                id: userId
            },
            select: {
                projects: true
            }
        })

        if (!user) {
            return res.status(200).json({
                msg: `User not found with given userID ${userId}`
            })
        }

        const projects = await prisma.project.findMany({
            where: {
                userId: userId
            },
            select: {
                id: true,
                title: true,
                userId: true
            }
        })

        if (!projects || projects.length === 0) {
            return res.status(400).json({
                msg: `Projects not found OR Empty Projects to User: ${userId}`
            })
        }

        res.status(200).json({
            msg: "Projects fetched Successfully!!",
            projects
        })
    } catch (error) {
        res.status(400).json({
            msg: "Failed to Fetch Projects, Error Occured!!",
            error
        })
    }
})

// DELETE /api/projects/:id
router.delete("/:projectId", async (req: Request, res, Response): Promise<any> => {
    const { projectId } = req.params ;
    const userId = req.query.userId as string;
    // const { token } = req.headers.authorization ; //if the user has logged in or jwt


    if(!projectId || !userId){
       return res.status(400).json({ msg: "Provide UserID and ProjectId in query params!!" })
    }

    try {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { projects: true }
        })

        if (!user) {
            return res.status(400).json({
                msg: `User not found with given userID ${userId}`
            })
        }

        const existingProject = await prisma.project.findUnique({
            where: {id: projectId}
        })

        if (!existingProject) {
            return res.status(400).json({
                msg: `Project not found with given projectId: ${projectId} or has Already Deleted!!`
            })
        }

        const project = await prisma.project.delete({
            where: {
                id: projectId
            }
        })

        return res.status(200).json({
            msg: "Project Deleted Successfully!!",
            project
        })


    } catch (error) {
        res.status(400).json({
            msg: "Failed to Delete Projects, Error Occured!!",
            error
        })
    }

})

export default router ;
