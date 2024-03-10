import { inject } from "inversify";
import { controller, httpGet, httpPost, interfaces, request, response } from "inversify-express-utils";
import { AuthService } from "../services/auth.service";
import { Request, Response } from "express";
import TYPES from "../types";
import { ILogger } from "../interfaces";
import * as jwt from 'jsonwebtoken';

@controller('/auth')
export class AuthController implements interfaces.Controller {

    authService: AuthService;
    loggerInstance: ILogger;

    constructor(@inject(TYPES.AuthService) authService: AuthService, @inject(TYPES.ILogger) loggerInstance: ILogger) {
        this.authService = authService;
        this.loggerInstance = loggerInstance;
    }
    @httpPost('/singIn')
    public async singIn(@request() req: Request, @response() res: Response) {
        try {
            const { body } = req;
            if (!body) {
                res.status(200).json({
                    message: 'Empty info, pls set your email and password'
                });
            }
            const user = await this.authService.singIn(body.email, body.password);

            res.cookie('refreshToken', user?.refreshToken, {
                httpOnly: true,
            })
            res.status(200).json(user);
        } catch (err) {
            this.loggerInstance.error(`Error in singIn action: ${err}`);
            res.status(400).json({
                error: err,
            }).end();
        }
    }
    @httpPost('/singUp')
    public async singUp(@request() req: Request, @response() res: Response) {
        try {
            const { body } = req; 
            if (!body || !body.email || !body.password) {
                res.status(200).json({
                    message: 'Empty info, pls set your email and password'
                });
            }
            await this.authService.singUp(body);
            res.status(200);
        } catch (err) {
            this.loggerInstance.error(`Error in singUp action: ${err}`);
            res.status(400).json({
                error: err,
            }).end();
        }
    }
    @httpGet('/refresh/:uuid')
    public async refreshToken(@request() req: Request, @response() res: Response) {
        try {
            const refresToken = req.cookies?.refreshToken;
            const key = process.env.SECRET_KEY;

            if (!refresToken || !jwt.verify(refresToken, key as jwt.Secret)) {
                throw new Error('Refresh token is invalid');
            }
            const { params } = req;
            if (!params || !params.uuid) {
                throw new Error('User uuid is not define');
            }
            const token = await this.authService.updateToken(params.uuid, refresToken)
            res.status(200).json(token).end();
        } catch (err) {
            this.loggerInstance.error(`Error in refresh token action: ${err}`);
            res.status(400).json({
                error: err,
            }).end();
        }
    } 
    @httpGet('/deleteCookies')
    public deleteCookies(@request() req: Request, @response() res: Response) {
        res.clearCookie('refreshToken', {
            httpOnly: true,
        })
        res.status(200).json();
    } 
    
}