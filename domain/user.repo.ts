import { FindAndCountOptions, Model, Op, WhereOptions } from "sequelize";
import { IRepository } from ".";
import { UserCreateModel } from "../types/createModelTypes";
import { PageRequest, PageResponse } from "../types/page";
import { ILogger } from '../interfaces';
import TYPES from '../types';
import { inject, injectable } from 'inversify';
import { User } from '../database/initTables';

@injectable()
export class UserRepository implements IRepository<User> {

    loggerInstance: ILogger;

    constructor(@inject(TYPES.ILogger) winstonLogger: ILogger) {
        this.loggerInstance = winstonLogger;
    }

    async create(createEntity: UserCreateModel) {
        try {
            const user = User.build({...createEntity});
            await user.save();
            this.loggerInstance.log(`Successfull create user uuid = ${user.uuid}`);
        } catch (e) {
            this.loggerInstance.error(`Create ${User.toString()} error: ${e}`);
        }
    }
    async update(entity: Omit<User, keyof Model>): Promise<void> {
        try {
            console.log('Entity', entity);
            const exitedEntity = await this.get(entity.uuid);
            if (!exitedEntity) throw new Error('Entity is not exits');
            User.update({
                ...entity
            }, {
              where: {
                uuid: entity.uuid,
              }
            })
            this.loggerInstance.log(`Successfull update user uuid = ${entity.uuid}`);
        } catch (error) {
            this.loggerInstance.error(`Update ${User.toString()} uuid = ${entity.uuid} error: ${error}`);
            throw new Error('Update is cancelled');
        }
    }
    async delete(uuid: string): Promise<void> {
        try {
            await User.destroy({
                where: {
                    uuid
                }
            })
            this.loggerInstance.log(`Successfull delete user uuid = ${uuid}`);
        }
        catch (error) {
            this.loggerInstance.error(`Delete ${User.toString()} uuid = ${uuid} error: ${error}`);
            throw new Error(`Deleting is canceled ${error}`);
        }
    }
    async get(uuid: string): Promise<User | undefined> {
        try {
            const whereOptions: WhereOptions<User> = {
                uuid,
            }
            const result = (await User.findOne({
                where: whereOptions,
            }));
            if (!result) {
                throw Error('No entity');
            }
            this.loggerInstance.log(`Successfull get user uuid = ${uuid}`);
            return result?.dataValues;
        } catch (error) {
            this.loggerInstance.error(`Get ${User.toString()} uuid = ${uuid} error: ${error}`);
            return undefined;
        }
    }
    async getList(pageRequest: PageRequest): Promise<PageResponse<User> | undefined> {
        try {
            console.log(pageRequest);
            const seqRequest: FindAndCountOptions = {
                limit: pageRequest.amount,
                offset: (pageRequest.pageNumber - 1) * pageRequest.amount,
            }
            seqRequest.order = [
                ['createdAt', 'DESC']
            ];
            if (pageRequest.search) {
                seqRequest.where = {
                    nickname: {
                        [Op.substring]: pageRequest.search
                    }
                }
            }
            console.log('prev');
            const data = await User.findAndCountAll(seqRequest);
            console.log('Data', data);
            return data;
        } catch (error) {
            this.loggerInstance.error(`Get list of ${User.toString()} error: ${error}`);
        } finally {
            return undefined
        }
    }

} 