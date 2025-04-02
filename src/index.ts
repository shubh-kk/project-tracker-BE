import express from 'express';
import  jwt  from 'jsonwebtoken'
import cors from 'cors'
import user from "./routes/user"
import projects from "./routes/project"
import task from "./routes/task"
import 'dotenv/config'

const app = express();
const router = express.Router();

app.use(cors())
app.use(express.json());

app.use("/api/v1/user", user);
app.use("/api/v1/projects", projects);
app.use("/api/v1/task", task) ;


app.listen(process.env.PORT,() => {
    console.log(`running`)
})