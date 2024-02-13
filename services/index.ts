import { ILogger } from "../interfaces";
import TYPES from '../types';
import { inject, injectable } from 'inversify';

@injectable()
export abstract class Service {
    logger: ILogger 
    constructor(@inject(TYPES.ILogger) logger: ILogger) {
        this.logger = logger;
    }
}