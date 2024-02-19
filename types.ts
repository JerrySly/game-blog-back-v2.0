const TYPES = {
    ILogger: Symbol('ILogger'),
    UserRepository: Symbol('UserRepository'),
    PostRepository: Symbol('PostRepository'),
    CommentService: Symbol('CommentService'),
    CommentRepository: Symbol('CommentRepository'),
    PostService: Symbol('PostService'),
    AuthService: Symbol('AuthService'),
    UserService: Symbol('UserService'),
    AuthMiddleware: Symbol('AuthMiddleware'),
};

export default TYPES;