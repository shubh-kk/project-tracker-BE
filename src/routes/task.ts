import { Router } from "express";
const router = Router() ;

router.get("/", function (req,res) {
    res.send("hello from task route")
})

export default router ;

// // Tasks 
// POST /api/tasks
// PATCH /api/tasks/:id (toggle complete)
// DELETE /api/tasks/:id
// POST /api/login

// // Projects
// GET /api/projects
// POST /api/projects 
// DELETE /api/projects/:id

// // Tasks 
// POST /api/tasks
// PATCH /api/tasks/:id (toggle complete)
// DELETE /api/tasks/:id