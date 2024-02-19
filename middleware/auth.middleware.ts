import { UserRepository } from './../domain/user.repo';
import { NextFunction, Request, Response } from "express";
import { injectable } from "inversify";
import { BaseMiddleware } from "inversify-express-utils";
import * as jwt from 'jsonwebtoken';

@injectable()
export class AuthMiddleware extends BaseMiddleware {

    handler(req: Request, res: Response, next: NextFunction): void {
        try {
            const authHeader = req.headers.authorization;
            if (!authHeader) {
                res.status(401).json({
                    err: 'You are not logged in'
                })
                throw new Error('User not logged');
            }
            if (!process.env.SECRET_KEY) {
                throw new Error('Secret key not set');
            }
            if(jwt.verify(authHeader, process.env.SECRET_KEY, {})) {
                next();
            } else {
                throw new Error('Token invalid');
            }
        } catch (err) {
            res.status(403).json({
                err: 'Token is invalid',
            })
        }
    }
}