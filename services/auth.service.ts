import { Service } from ".";
import { User } from "../database/initTables";
import bcrypt from 'bcrypt';
import * as jwt from "jsonwebtoken";
import { hashingText } from "../utils/hash";
import { Model } from "sequelize";
import { UserInfo } from '../types/user';
import TYPES from "../types";
import { inject, injectable } from "inversify";
import { IRepository } from "../domain";
import { ILogger } from "../interfaces";

@injectable()
export class AuthService extends Service {
    repository: IRepository<User>;
    constructor(@inject(TYPES.UserRepository) userRepo: IRepository<User>, @inject(TYPES.ILogger) logger: ILogger) {
        super(logger);
        this.repository = userRepo;
    }
    async singIn(email: string, password: string): Promise<UserInfo | undefined> {
        try {
            const user = (await User.findOne({
                where: {
                    email,
                }
            }))?.dataValues;
            if (!user) {
                throw new Error('User not founded');
            }
    
            const isCorrectPassword = bcrypt.compareSync(password, user.password);
            if (!isCorrectPassword) {
                throw new Error('Password not correct');
            }
            const key = process.env.SECRET_KEY;
            const token = jwt.sign({
                _uuid: user.uuid,
                _email: user.email,
                _role: user.roleUuid,
                _nickname: user.nickname,
            }, key as jwt.Secret, {
                expiresIn: process.env.EXPIRE_TIME,
            });
    
    
            return {
                nickname: user.nickname,
                role: user.roleUuid,
                uuid: user.uuid,
                token,
            };
        } catch (error) {
            this.logger.error(`Auth service singIn error: ${error}`);
            return undefined;
        }
    }

    async singUp(userData: Omit<User, keyof Model>): Promise<void> {
        try {
            console.log('UserData', userData);
            const { password } = userData;
            if (!userData.role) userData.role = 'a2d018cc-a99a-4c24-86f4-ef0298fe2e73';
            userData.password = await hashingText(password);
            const beforeUser = (await User.findOne({
                where: {
                    email: userData.email,
                }
            }))?.dataValues;
            if (beforeUser) {
                throw new Error('User already exist');
            }
            await this.repository.create(userData);
        } catch (error) {
            this.logger.error(`Auth service singUp error: ${error}`);
        }
    }
}