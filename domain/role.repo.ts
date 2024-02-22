import { ILogger } from './../interfaces/index';
import { Model, WhereOptions } from "sequelize";
import { IRepository } from ".";
import { Role } from "../database/initTables";
import { CreateModel } from "../types/createModelTypes";
import { PageRequest, PageResponse } from "../types/page";
import { Op } from "sequelize";
import { loggerInstance } from '../utils/logger';
import { inject, injectable } from 'inversify';
import TYPES from '../types';

@injectable()
export class RoleRepository implements IRepository<Role> {

 constructor(@inject(TYPES.ILogger) public loggerInstance: ILogger) {}
 
 create(createEntity: CreateModel): void | Promise<void> {
  throw new Error("Method not implemented.");
 }
 update(entity: Omit<Role, keyof Model<any, any>>): void | Promise<void> {
  throw new Error("Method not implemented.");
 }
 delete(uuid: string): void | Promise<void> {
  throw new Error("Method not implemented.");
 }
 async get(uuid: string): Promise<Role | undefined> {
  try {
   const whereOptions: WhereOptions<Role> = {
       uuid,
   }
   const result = (await Role.findOne({
       where: whereOptions,
   }));
   if (!result) {
       throw Error('No entity');
   }
   this.loggerInstance.log(`Successfull get role uuid = ${uuid}`);
   return result?.dataValues;
} catch (error) {
   this.loggerInstance.error(`Get ${Role.toString()} uuid = ${uuid} error: ${error}`);
   return undefined;
}
 }
 getList(pageRequest: PageRequest): PageResponse<Role> | Promise<PageResponse<Role> | undefined> {
   throw new Error("Method not implemented.");
 }

 async getFullList(): Promise<Array<Role>> {
  return await Role.findAll();
 }
}
