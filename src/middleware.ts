import { NextFunction, Request, Response } from "express";

const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRETE ;

function verifyToken(req: Request, res: Response, next: NextFunction) {
    const token = req.header('Authorization');
    if (!token) return res.status(401).json({ error: 'Access denied' });
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        //@ts-ignore
        req.userId = decoded.userId ;
        next();
    } catch (error) {
        res.status(401).json({ error: 'Invalid token' });
    }
};

module.exports = verifyToken;