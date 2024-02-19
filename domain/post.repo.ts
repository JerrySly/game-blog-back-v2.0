import { WinstonLogger } from '../utils/logger';
import { FindAndCountOptions, Model, Op, WhereOptions } from "sequelize";
import { IRepository } from ".";
import { CreateModel, PostCreateModel } from "../types/createModelTypes";
import { PageRequest, PageResponse } from "../types/page";
import { TYPE } from "inversify-express-utils";
import { ILogger } from '../interfaces';
import TYPES from '../types';
import { inject, injectable } from 'inversify';
import sequelize from 'sequelize';
import { Post } from '../database/initTables';

@injectable()
export class PostRepository implements IRepository<Post> {

    loggerInstance: ILogger;

    constructor(@inject(TYPES.ILogger) winstonLogger: ILogger) {
        this.loggerInstance = winstonLogger;
    }

    async create(createEntity: PostCreateModel) {
        try {
            const post = Post.build({...createEntity});
            await post.save();
            this.loggerInstance.log(`Successfull create post uuid = ${post.uuid}`);
        } catch (e) {
            this.loggerInstance.error(`Create ${Post.toString()} error: ${e}`);
        }
    }
    async update(entity: Omit<Post, keyof Model>): Promise<void> {
        try {
            const exitedEntity = await this.get(entity.uuid);
            if (!exitedEntity) throw new Error('Entity is not exits');
            Post.update({
                ...entity
            }, {
              where: {
                uuid: entity.uuid,
              }
            })
            this.loggerInstance.log(`Successfull update post uuid = ${entity.uuid}`);
        } catch (error) {
            this.loggerInstance.error(`Update ${Post.toString()} uuid = ${entity.uuid} error: ${error}`);
            throw new Error('Update is cancelled');
        }
    }
    async delete(uuid: string): Promise<void> {
        try {
            await Post.destroy({
                where: {
                    uuid
                }
            })
            this.loggerInstance.log(`Successfull delete post uuid = ${uuid}`);
        }
        catch (error) {
            this.loggerInstance.error(`Delete ${Post.toString()} uuid = ${uuid} error: ${error}`);
            throw new Error(`Deleting is canceled ${error}`);
        }
    }
    async get(uuid: string): Promise<Post | undefined> {
        try {
            const whereOptions: WhereOptions<Post> = {
                uuid,
            }
            const result = (await Post.findOne({
                where: whereOptions,
            }));
            if (!result) {
                throw Error('No entity');
            }
            this.loggerInstance.log(`Successfull get post uuid = ${uuid}`);
            return result?.dataValues;
        } catch (error) {
            this.loggerInstance.error(`Get ${Post.toString()} uuid = ${uuid} error: ${error}`);
        } finally {
            return undefined;
        }
    }
    async getList(pageRequest: PageRequest): Promise<PageResponse<Post> | undefined> {
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
                    title: {
                        [Op.substring]: pageRequest.search
                    }
                }
            }
            console.log('prev');
            const data = await Post.findAndCountAll(seqRequest);
            console.log('Data', data);
            return data;
        } catch (error) {
            this.loggerInstance.error(`Get list of ${Post.toString()} error: ${error}`);
        } finally {
            return undefined
        }
    }

} 