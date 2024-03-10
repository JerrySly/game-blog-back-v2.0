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
        console.log('Data', email, password);
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
            console.log(user);
            const token = jwt.sign({
                _uuid: user.uuid,
                _name: user.nickname,
                _role: user.role,
            }, key as jwt.Secret, {
                expiresIn: process.env.USUAL_TOKEN_EXPIRE_TIME,
            });
            
            const refreshToken = jwt.sign({
            }, key as jwt.Secret, {
                expiresIn: process.env.REFRESH_TOKEN_EXPIRE_TIME,
            })
            console.log('SingIn', refreshToken);
            await this.repository.update({
                ...user,
                refreshToken,
            })
            console.log('ROLE', user.role);
            return {
                nickname: user.nickname,
                role: user.role,
                uuid: user.uuid,
                token,
                refreshToken: refreshToken,
            };
        } catch (error) {
            this.logger.error(`Auth service singIn error: ${error}`);
            return undefined;
        }
    }

    async singUp(userData: Omit<User, keyof Model>): Promise<void> {
        try {
            const { password } = userData;
            const key = process.env.SECRET_KEY;

            const refreshToken = jwt.sign({
            }, key as jwt.Secret, {
                expiresIn: process.env.REFRESH_TOKEN_EXPIRE_TIME,
            })
            if (!userData.role) userData.role = 'a2d018cc-a99a-4c24-86f4-ef0298fe2e73';
            userData.password = await hashingText(password);
            userData.refreshToken = refreshToken;
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

    async updateToken(uuid: string, refreshToken: string): Promise<string> {
        const user = await this.repository.get(uuid);
        if (!user) {
            throw new Error('User is not exist');
        }
        console.log(refreshToken, user.refreshToken);
        if (refreshToken !== user.refreshToken) {
            throw new Error('User refresh token is invalid');
        }
        const key = process.env.SECRET_KEY;
        const token = jwt.sign({
            __uuid: uuid,
        }, key as jwt.Secret, {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRE_TIME,
        })

        return token;
    }
}