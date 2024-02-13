export interface CreateModel {}
export interface PostCreateModel extends CreateModel {
    mainPicture: string;
    startText: string;
    mainText: string;
    title: string;
}