import { inject } from "inversify";
import { controller, httpPost, interfaces, request, response } from "inversify-express-utils";
import { AuthService } from "../services/auth.service";
import { Request, Response } from "express";
import TYPES from "../types";

@controller('/auth')
export class AuthController implements interfaces.Controller {

    authService: AuthService;

    constructor(@inject(TYPES.AuthService) authService: AuthService) {
        this.authService = authService;
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
            res.json(user).status(200);
        } catch (e) {
            res.status(500).end();
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
        } catch (e) {
            res.status(500).end();
        }
    }
}