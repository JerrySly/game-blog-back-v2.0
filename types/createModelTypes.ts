export interface CreateModel {}
export interface PostCreateModel extends CreateModel {
    mainPicture: string;
    startText: string;
    mainText: string;
    title: string;
}

export interface UserCreateModel extends CreateModel {
    email: string,
    password: string,
    nickname: string,
    role?: number,
}

export interface CommentCreateModel extends CreateModel {
    text: string,
    createdBy: string,
    parrent: string,
}