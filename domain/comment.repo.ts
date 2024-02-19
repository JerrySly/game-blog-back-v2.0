import { Comment } from './../database/initTables';
import { loggerInstance } from './../utils/logger';
import { FindAndCountOptions, Model, Op, WhereOptions } from "sequelize";
import { IRepository } from ".";
import { CommentCreateModel, CreateModel } from "../types/createModelTypes";
import { PageRequest, PageResponse } from "../types/page";
import { inject, injectable } from "inversify";
import TYPES from "../types";
import { ILogger } from "../interfaces";

@injectable()
export class CommentRepository implements IRepository<Comment> {
    loggerInstance: ILogger;

    constructor(@inject(TYPES.ILogger) winstonLogger: ILogger) {
        this.loggerInstance = winstonLogger;
    }

    async create(createEntity: CommentCreateModel) {
        try {
            const comment = Comment.build({...createEntity});
            await comment.save();
            this.loggerInstance.log(`Successfull create comment uuid = ${comment.uuid}`);
        } catch (e) {
            this.loggerInstance.error(`Create ${Comment.toString()} error: ${e}`);
        }
    }
    async update(entity: Omit<Comment, keyof Model>): Promise<void> {
        try {
            const exitedEntity = await this.get(entity.uuid);
            if (!exitedEntity) throw new Error('Entity is not exits');
            Comment.update({
                ...entity
            }, {
              where: {
                uuid: entity.uuid,
              }
            })
            this.loggerInstance.log(`Successfull update comment uuid = ${entity.uuid}`);
        } catch (error) {
            this.loggerInstance.error(`Update ${Comment.toString()} uuid = ${entity.uuid} error: ${error}`);
            throw new Error('Update is cancelled');
        }
    }
    async delete(uuid: string): Promise<void> {
        try {
            await Comment.destroy({
                where: {
                    uuid
                }
            })
            this.loggerInstance.log(`Successfull delete comment uuid = ${uuid}`);
        }
        catch (error) {
            this.loggerInstance.error(`Delete ${Comment.toString()} uuid = ${uuid} error: ${error}`);
            throw new Error(`Deleting is canceled ${error}`);
        }
    }
    async get(uuid: string): Promise<Comment | undefined> {
        try {
            const whereOptions: WhereOptions<Comment> = {
                uuid,
            }
            const result = (await Comment.findOne({
                where: whereOptions,
            }));
            if (!result) {
                throw Error('No entity');
            }
            this.loggerInstance.log(`Successfull get comment uuid = ${uuid}`);
            return result?.dataValues;
        } catch (error) {
            this.loggerInstance.error(`Get ${Comment.toString()} uuid = ${uuid} error: ${error}`);
        } finally {
            return undefined;
        }
    }
    async getList(pageRequest: PageRequest): Promise<PageResponse<Comment> | undefined> {
        try {
            const seqRequest: FindAndCountOptions = {
                limit: pageRequest.amount,
                offset: (pageRequest.pageNumber - 1) * pageRequest.amount,
            }
            seqRequest.order = [
                ['createdAt', 'DESC']
            ];
            if (pageRequest.search) {
                seqRequest.where = {
                    postUuid: {
                        [Op.eq]: pageRequest.entityUuid
                    }
                }
            }
            const data = await Comment.findAndCountAll(seqRequest);
            return data;
        } catch (error) {
            this.loggerInstance.error(`Get list of ${Comment.toString()} error: ${error}`);
        } finally {
            return undefined
        }
    }


}