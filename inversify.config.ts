
import TYPES from './types';

import {Container} from 'inversify';

import { WinstonLogger } from './utils/logger';
import { IRepository } from './domain';
import { PostRepository } from './domain/postRepository';
import { Post } from './database/initTables';
import { ILogger } from './interfaces';
import { PostService } from './services/post.service';

const container = new Container();

container.bind(TYPES.ILogger).to(WinstonLogger).inSingletonScope();
container.bind(TYPES.Service).to(PostService).inSingletonScope();
container.bind<IRepository<Post>>(TYPES.IRepository).to(PostRepository).inSingletonScope();
export default container;