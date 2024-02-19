import { PageRequest, PageResponse } from './../types/page.d';
import { inject, injectable } from "inversify";
import { Service } from ".";
import { CommentCreateModel } from "../types/createModelTypes";
import TYPES from "../types";
import { WinstonLogger, loggerInstance } from "../utils/logger";
import { CommentRepository } from "../domain/comment.repo";
import { ILogger } from "../interfaces";
import { Comment } from "../database/initTables";
import { Model } from "sequelize";

@injectable()
export class CommentService extends Service {

    constructor(@inject(TYPES.CommentRepository) public repository: CommentRepository, 
    @inject(TYPES.ILogger) loggerInstance: ILogger) {
        super(loggerInstance);
    }
    async editComment (comment: Omit<Comment, keyof Model>): Promise<void> {
        await this.repository.update(comment);
    }
    
    async deleteComment (uuid: string): Promise<void> {
        await this.repository.delete(uuid);
    }

    async createComment (newComment: CommentCreateModel) {
        await this.repository.create(newComment);
    };

    async getList (postUuid: string, page: number): Promise<PageResponse<Comment> | undefined> {
        return await this.repository.getList({
            entityUuid: postUuid,
            amount: 15,
            pageNumber: page,
        });
    }
}