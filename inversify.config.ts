
import TYPES from './types';

import {Container} from 'inversify';

import { WinstonLogger } from './utils/logger';
import { IRepository } from './domain';
import { PostRepository } from './domain/postRepository';
import { Post, User } from './database/initTables';
import { PostService } from './services/post.service';
import { AuthService } from './services/auth.service';
import { UserRepository } from './domain/userRepository';

const container = new Container();

container.bind(TYPES.ILogger).to(WinstonLogger).inSingletonScope();
container.bind(TYPES.PostService).to(PostService).inSingletonScope();
container.bind(TYPES.AuthService).to(AuthService).inSingletonScope();
container.bind<IRepository<Post>>(TYPES.PostRepository).to(PostRepository).inSingletonScope();
container.bind<IRepository<User>>(TYPES.UserRepository).to(UserRepository).inSingletonScope();
export default container;