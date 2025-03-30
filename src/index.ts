import express from 'express';
import  jwt  from 'jsonwebtoken'
const app = express();
const JWT_SECRET = "mysecretpassword" ;

app.use(express.json());

app.post("/signup", (req, res) => {
    const email = req.body.email ;
    const password = req.body.password ;
    //db validation
    try {
        const token = jwt.sign(email, JWT_SECRET)
        res.json({
            "msg": "Signin Successful",
            token
        })
        console.log(`Token for user ${email} is ${token}`);
        return ;
        
    } catch (error) {
        console.log("Error occued while signin!!");
        return;
    }    
});

app.listen((3000))