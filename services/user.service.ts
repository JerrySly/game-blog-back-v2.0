import { loggerInstance } from './../utils/logger';
import { ILogger } from './../interfaces/index';
import { UserRepository } from './../domain/user.repo';
import { Service } from ".";
import { PageRequest } from "../types/page";
import TYPES from '../types';
import { inject } from 'inversify';

export class UserService extends Service {
    
    constructor(@inject(TYPES.UserRepository) public userRepo: UserRepository, @inject(TYPES.ILogger) loggerInstance: ILogger) {
        super(loggerInstance);
    }

    public async getUserList(pageRequest: PageRequest) {
        return await this.userRepo.getList(pageRequest);
    }

    public async getUser(uuid: string) {
        return await this.userRepo.get(uuid);
    }
}