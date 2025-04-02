import express from 'express';
import cors from 'cors'
import user from "./routes/user"
import projects from "./routes/project"
import task from "./routes/task"
import 'dotenv/config'

const app = express();

app.use(cors())
app.use(express.json());
const PORT = process.env.PORT || 3000;

app.use("/api/v1/user", user);
app.use("/api/v1/projects", projects);
app.use("/api/v1/task", task) ;


app.listen(PORT,() => {
    console.log(`running`)
})