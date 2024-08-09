import { Request, Response, NextFunction } from 'express';

export const isJudge = (req: Request, res: Response, next: NextFunction) => {
    if (req.body.role && req.body.role === 'judge') {
        next();
    } else {
        res.status(403).send('Access denied. Only judges are allowed to perform this action.');
    }
};
