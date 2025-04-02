import { Request, Response, Router } from "express";
import { PrismaClient } from "@prisma/client";
// import { verifyToken } from "../middleware"
const verifyToken = require("../middleware")

const prisma = new PrismaClient() ;
const router = Router() ;

// POST /api/tasks
router.post("/", async (req: Request, res: Response) => {
    const title = req.body.title ;
    const projectId = req.query.projectId as string ;
    // const { token } = req.headers.authorization ; //if the user has logged in or jwt


    if(!projectId){
        res.status(400).json({ msg: "Provide a ProjectId in query params!!" });
        return ;
    }

    try {
        const project = await prisma.project.findUnique({
            where: {
                id: projectId
            }
        })

        if(!project){
             res.status(400).json({
                msg: `Projects not found with given projectid: ${projectId}`
            })
            return ;
        }

        const task = await prisma.task.create({
            data: {
                title,
                isComplete: false,
                projectId,
            }
        })

        res.status(200).json({
            msg: `Task created successfully !!`,
            task
        })
    } catch (error) {
        res.status(400).json({
            msg: "Can't create task, Error Occured!!",
            error
        })
    }
})

// PATCH /api/tasks/:id (toggle complete)
router.patch("/:taskId", async (req: Request, res: Response): Promise<any> => {
    const { taskId } = req.params;
    // const { token } = req.headers.authorization ; //if the user has logged in or jwt

    try {
        const task = await prisma.task.findUnique({
            where: {id: taskId}
        })

        if(!task){
            return res.status(404).json({
                msg: `Task not found or not given taskId`
            })
        }
        const updatedTask = await prisma.task.update({
            where: { id: taskId },
            data: { isComplete: true }
        })
        res.status(200).json({
            msg: "Task Marked as Completed!!",
            updatedTask
        })
        // if (req.body.title) task.title = req.body.title
        // if (req.body.isComplete) task.isComplete = req.body.isComplete;

        // const allowedFields = ['title', 'isComplete']
        // const dataToUpdate = {}

        // if (!allowedFields.includes(field)) {
        //     return res.status(400).json({ msg: 'Field not allowed for update' });
        // }

        // allowedFields.forEach(field => {
        //   if (req.body.hasOwnProperty(field)) {
        //     dataToUpdate[field] = req.body[field];
        //   }
        // });

        // const updatedTask = await prisma.task.update({
        //     where: {id: taskId},
        //     data: {
        //         ...task,// Keep existing data
        //         ...req.body // Overwrite only the fields provided in the request
        //     }
        // })
       
    } catch (error) {
        res.status(500).json({ message: 'Error whiel updating task', error });
    }
});

// DELETE /api/tasks/:id
router.delete("/:taskId", async (req: Request, res: Response) => {
    const { taskId } = req.params ;
    const projectId = req.query.projectId as string ;
    // const { token } = req.headers.authorization ; //check valid user by jwt

    if (!taskId || !projectId) {
        res.status(400).json({ msg: "Provide a taskID in URL & ProjectId in query params!!" });
        return ;
    }

    try {
        const task = await prisma.task.findFirst({
            where: {
                id: taskId,
                projectId
            }
        })

        if(!task){
            res.status(400).json({
                msg: "taskId or ProjectId is invalid"
            })
            return ;
        }

        await prisma.task.delete({
            where: { id: taskId }
        })

        res.status(200).json({msg: "Task deleted"})
    } catch (error) {
        res.status(500).json({ message: 'Error while Deleting task', error });
    }

})

export default router ;
