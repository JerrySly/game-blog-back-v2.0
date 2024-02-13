import { PageRequest, PagesMeta, PageResponse } from '../types/page';
import { Model } from 'sequelize';
import { Service } from '.';
import { inject, injectable } from 'inversify';
import { PostCreateModel } from '../types/createModelTypes';
import TYPES from '../types';
import { ILogger } from '../interfaces';
import { IRepository } from '../domain';
import { Post } from '../database/initTables';


interface PostPageRequest extends PageRequest {
}

@injectable()
export class PostService extends Service {

  private repository: IRepository<Post>;
  constructor(@inject(TYPES.IRepository) repository: IRepository<Post>, @inject(TYPES.ILogger) loggerInstance: ILogger) {
    super(loggerInstance);
    this.repository = repository;
  }


  async editPost (post: Omit<Post, keyof Model>): Promise<void> {
    await this.repository.update(post);
  }
  
  async deletePost (uuid: string): Promise<void> {
    await this.repository.delete(uuid);
  }
  
  async setHiddenStatus (value: boolean, uuid: string) {
    const post = await this.repository.get(uuid);
    if (!post) return;
    post.hided = value;
    this.repository.update(post);
  }
  
  calculatePageMeta (request: PageRequest, count: number): PagesMeta {
    const pages = count / request.amount;
    const left = count - request.amount * request.pageNumber;
    const meta: PagesMeta = {
      leftCount: left > 0 ? left : 0,
      prevPage: request.pageNumber >= 2 ? request.pageNumber - 1 : null,
      nextPage: pages > request.pageNumber ? request.pageNumber + 1 : null, 
    } 
    return meta;
  }
  
  async createPost (newPost: PostCreateModel) {
    await this.repository.create(newPost);
  };
  
  async getPosts(pageRequest: PostPageRequest): Promise<PageResponse<Post> | undefined>  {
    return await this.repository.getList(pageRequest);
  }
  
  async getPost(uuid: string): Promise<Post | undefined> {
    return await this.repository.get(uuid);
  }
}

