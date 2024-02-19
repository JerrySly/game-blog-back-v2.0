import { loggerInstance } from './../utils/logger';
import { inject } from "inversify";
import { controller, httpDelete, httpGet, httpPost, httpPut, interfaces, request, response } from "inversify-express-utils";
import TYPES from "../types";
import { ILogger } from "../interfaces";
import { Request, Response } from 'express';
import { CommentService } from '../services/comment.service';

@controller('/comment', TYPES.AuthMiddleware)
export class CommentController implements interfaces.Controller {

    loggerInstance: ILogger;
    commentService: CommentService;
    constructor(@inject(TYPES.ILogger) loggerInstance: ILogger, @inject(TYPES.CommentService) commentService: CommentService) {
        this.loggerInstance = loggerInstance;
        this.commentService = commentService;
    }

    @httpPost('/create')
    public async createComment(@request() req: Request, @response() res: Response) {
        try {
            const { body } = req;
            if (!body || !body.text) {
                throw new Error('Wrong comment');
            }
            await this.commentService.createComment(body);
            res.status(200);
        } catch (err) {
            loggerInstance.error(`Create comment action error: ${err}`);
        }
    }

    @httpGet('/:uuid')
    public async getComments(@request() req: Request, @response() res: Response) {
        try {
            const { params, query } = req;
            if (!params || !params.uuid ) {
                throw new Error('Undefined post');
            }
            if (!query || !query.page) {
                throw new Error('Undefined page number');
            }
            const result = await this.commentService.getList(params.uuid, Number.parseInt(query.page.toString(), 10));
            res.status(200).json(result);
        } catch (err) {
            loggerInstance.error(`Get comments action error: ${err}`);
        }
    }

    @httpPut('/edit/:uuid')
    public async updateComment(@request() req: Request, @response() res: Response) {
        try {
            const { params, body } = req;
            if (!params || !params.uuid) {
                throw new Error('Undefined comment');
            }
            if (!body) {
                throw new Error('Missing data for update');
            }
            await this.commentService.editComment({
                ...body,
                uuid: params.uuid,
            })
            res.status(200);
        } catch (err) {
            loggerInstance.error(`Edit comment action error: ${err}`);
        }
    }

    @httpDelete('/:uuid')
    public async delete(@request() req: Request, @response() res: Response) {
        try {
            const { params } = req;
            if (!params || !params.uuid) {
                throw new Error('Undefined commenr');
            }
        } catch (err) {
            loggerInstance.error(`Delete comment action error: ${err}`);
        }
    }
}