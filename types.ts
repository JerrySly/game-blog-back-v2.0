const TYPES = {
    ILogger: Symbol('ILogger'),

    UserRepository: Symbol('UserRepository'),
    PostRepository: Symbol('PostRepository'),
    RoleRepository: Symbol('RoleRepository'),
    CommentRepository: Symbol('CommentRepository'),

    CommentService: Symbol('CommentService'),
    PostService: Symbol('PostService'),
    AuthService: Symbol('AuthService'),
    UserService: Symbol('UserService'),
    RoleService: Symbol('RoleService'),

    AuthMiddleware: Symbol('AuthMiddleware'),
};

export default TYPES;