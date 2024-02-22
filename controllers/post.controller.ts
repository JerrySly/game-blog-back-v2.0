import { Request, Response } from "express";
import { controller, httpDelete, httpGet, httpPost, httpPut, interfaces, request, response } from "inversify-express-utils";
import TYPES from "../types";
import { PostService } from "../services/post.service";
import { inject } from "inversify";
import { ILogger } from "../interfaces";
import { PageRequest } from "../types/page";

@controller('/post')
export class PostController implements interfaces.Controller {
    private postService: PostService;
    private logger: ILogger;
    constructor(@inject(TYPES.PostService) postService: PostService, @inject(TYPES.ILogger) logger: ILogger) {
        this.postService = postService;
        this.logger = logger;
    }
    @httpGet('/:uuid')
    public get(@request() req: Request, @response() res: Response) {
        try {
            const { params } = req;
            this.postService.getPost(params.uuid).then(data => {
                res.status(200).send(data);
            })
            this.logger.log('post controller: get done');
        } catch (err) {
            this.logger.log(`post controller erros: ${err}`);
            res.status(400).json(err);
        }
    }
    @httpGet('/')
    public getList(@request() req: Request, @response() res: Response) {
        try {
            const { query } = req;
            const pageRequest: PageRequest = {
                pageNumber: Number.parseInt(query.page as string, 10) as number,
                amount: Number.parseInt(query.amount as string, 10) as number,
            }
            if (query?.search) {
                pageRequest.search = query.search as string;
            }
            console.log('11', pageRequest);
            this.postService.getPosts(pageRequest).then(data => {
                console.log('Inner data', data);
                if (!data?.count) {
                    console.log('No data');
                    res.status(200).json(data);
                    return;
                }
                res.status(200).json({
                    data,
                    meta: this.postService.calculatePageMeta(pageRequest, data?.count)
                });
            })
            this.logger.log('post controller: getList done');
        } catch (err) {
            this.logger.log(`post controller erros: ${err}`);
            res.status(400).json(err);
        }
    }
    @httpPost('/', TYPES.AuthMiddleware)
    public create(@request() req: Request, @response() res: Response) {
        try {
            const { body } = req;
            this.postService.createPost(body).then(data => {
                res.status(200).send(data);
            })
            this.logger.log('post controller: create done');
        } catch (err) {
            res.status(400).json(err);
            this.logger.log(`post controller erros: ${err}`);
        }
    }
    @httpPut('/', TYPES.AuthMiddleware)
    public update(@request() req: Request, @response() res: Response) {
        try {
            const { body } = req;
            this.postService.editPost(body).then(data => {
                res.status(200).send(data);
                res.end();
            })
            this.logger.log('post controller: update done');
        } catch (err) {
            res.status(400).json(err);
            this.logger.log(`post controller erros: ${err}`);
        }
    }
    @httpPut('/hidden/:uuid', TYPES.AuthMiddleware)
    public hide(@request() req: Request, @response() res: Response) {
        try {
            const { params, body } = req;
            this.postService.setHiddenStatus(body.value, params.uuid).then(data => {
                res.status(200).send(data);
                res.end();
            });
            this.logger.log('post controller: hidden done');
        } catch (err) {
            res.status(400).json(err);
            this.logger.log(`post controller erros: ${err}`);
        }
    }
    @httpDelete('/:uuid', TYPES.AuthMiddleware)
    public delete(@request() req: Request, @response() res: Response) {
        try {
            const { params } = req;
            this.postService.deletePost(params.uuid).then( result => {
                res.status(200).send(result);
            })
            this.logger.log('post controller: delete done');
        } catch (err) {
            res.status(400).json(err);
            this.logger.log(`post controller erros: ${err}`);
        }
    }
}