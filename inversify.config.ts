
import TYPES from './types';

import {Container} from 'inversify';

import { WinstonLogger } from './utils/logger';
import { IRepository } from './domain';
import { PostRepository } from './domain/post.repo';
import { Post, User, Comment, Role } from './database/initTables';
import { PostService } from './services/post.service';
import { AuthService } from './services/auth.service';
import { UserRepository } from './domain/user.repo';
import { CommentRepository } from './domain/comment.repo';
import { CommentService } from './services/comment.service';
import { UserService } from './services/user.service';
import { AuthMiddleware } from './middleware/auth.middleware';
import { RoleRepository } from './domain/role.repo';
import { RoleService } from './services/role.service';

const container = new Container();

container.bind(TYPES.ILogger).to(WinstonLogger).inSingletonScope();

container.bind(TYPES.PostService).to(PostService).inSingletonScope();
container.bind(TYPES.AuthService).to(AuthService).inSingletonScope();
container.bind(TYPES.CommentService).to(CommentService).inSingletonScope();
container.bind(TYPES.UserService).to(UserService).inSingletonScope();
container.bind(TYPES.RoleService).to(RoleService).inSingletonScope();

container.bind<IRepository<Post>>(TYPES.PostRepository).to(PostRepository).inSingletonScope();
container.bind<IRepository<User>>(TYPES.UserRepository).to(UserRepository).inSingletonScope();
container.bind<IRepository<Comment>>(TYPES.CommentRepository).to(CommentRepository).inSingletonScope();
container.bind<IRepository<Role>>(TYPES.RoleRepository).to(RoleRepository).inSingletonScope();

container.bind(TYPES.AuthMiddleware).to(AuthMiddleware).inSingletonScope();
export default container;