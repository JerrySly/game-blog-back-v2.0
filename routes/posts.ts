import express, { Request, Response, Express } from "express";
import { PostService } from "../services/post.service";
import { PageRequest } from "../types/page";
import { validate } from 'uuid';
import { ExpressRouteFunc } from "../types/expressRouteFunc";

export const addPostRoutes = (app: Express, path: string,  ...services: any ) => {
  const postRouter = express.Router();
  const postService = new PostService(services.logger);

  postRouter.post('/', createPost(postService));
  postRouter.get('/', getPosts(postService));
  postRouter.get('/:uuid', getPostCallBack(postService));
  postRouter.put('/:uuid', editPost(postService));
  postRouter.put('/hidden/:uuid', setHidePost(postService));
  postRouter.delete('/:uuid', deletePost(postService));



  function createPost(postService: PostService): ExpressRouteFunc {
    return (req: Request, res: Response) => {
      const { body } = req;
      try {
        postService.createPost(body).then(data => {
          res.status(200).send(data);
        });
      } catch (e) {
        console.log(e);
        res.status(500).send('Error on back');
      }
    }
  }

  function getPosts(postService: PostService): ExpressRouteFunc {
    return (req: Request, res: Response) => {
      const { query } = req;
      const pageRequest: PageRequest = {
        pageNumber: Number.parseInt(query.page as string, 10) as number,
        amount: Number.parseInt(query.amount as string, 10) as number,
      }
      if (query?.search) {
        pageRequest.search = query.search as string;
      }
      postService.getPosts(pageRequest).then(data => {
        const meta = postService.calculatePageMeta(pageRequest, data.count);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.write(JSON.stringify( {
          data,
          meta,
        }));
        res.end();
      })
    }
  }

  function getPostCallBack(postService: PostService): ExpressRouteFunc {
    return (req: Request, res: Response) => {
      const { params } = req;
      let identifier: string | number;
      console.log(params);
      identifier = validate(params.idOrUuid) ? params.idOrUuid : Number.parseInt(params.idOrUuid, 10);  
      console.log('id', identifier);
      postService.getPost(identifier).then(data => {
        res.status(200).send(data);
        res.end();
      })
    }
  }

  function editPost(postService: PostService): ExpressRouteFunc {
    return (req: Request, res: Response) => {
      const { body } = req;
      postService.editPost(body).then(data => {
        res.status(200).send(data);
        res.end();
      })
    }
  }

  function setHidePost(postService: PostService): ExpressRouteFunc {
    return (req: Request, res: Response) => {
      const { params, body } = req;
      postService.setHiddenStatus(body.value, params.uuid).then(data => {
        res.status(200).send(data);
        res.end();
      });
    }
  }

  function deletePost(postService: PostService): ExpressRouteFunc {
    return (req: Request, res: Response) => {
      const { params } = req;
      if (!params?.uuid) res.status(404).json({
        message: 'uuid is empty or unvalid'
      })
      postService.deletePost(params.uuid).then( result => {
        res.status(200).send(result);
      })
    }
  }

  app.use(path, postRouter);
}
