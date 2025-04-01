// // Projects
// GET /api/projects
// POST /api/projects 
// DELETE /api/projects/:id

import { Router } from 'express' ;
const router = Router() ;

router.get("/", function (req,res){
    res.send("hello from projects route")
})

export default router ;