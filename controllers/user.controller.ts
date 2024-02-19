import { Request, Response } from "express";
import { controller, httpGet, interfaces, request, response } from "inversify-express-utils";
import TYPES from "../types";
import { loggerInstance } from "../utils/logger";
import { ILogger } from "../interfaces";
import { UserService } from "../services/user.service";
import { inject } from "inversify";

@controller('/user', TYPES.AuthMiddleware)
export class  UserController implements interfaces.Controller {

    constructor(
        @inject(TYPES.ILogger) public loggerInstance: ILogger,
        @inject(TYPES.UserService) public userService: UserService
    ) {}

    @httpGet('/')
    public async getList(@request() req: Request, @response() res: Response) {
        try {
            const { query } = req;
            if (!query || !query.page) {
                throw new Error('Undefined page');
            }
            const result = await this.userService.getUserList({
                pageNumber: Number.parseInt(query.page?.toString(), 10),
                amount: Number.parseInt((query.amount ?? 15)?.toString(), 10),
            })
            res.status(200).json(result);
        }   catch (err) {
            loggerInstance.error(`Error in get users list actions: ${err}`);
        }
    } 

    @httpGet('/:uuid')
    public async getUser(@request() req: Request, @response() res: Response) {
        try {
            const { params } = req;
            if (!params || !params.uuid) {
                throw new Error('Undefined uuid');
            }
            const result = await this.userService.getUser(params.uuid);
            res.status(200).json(result);
        }   catch (err) {
            loggerInstance.error(`Error in get user action: ${err}`);
        }
    }
}