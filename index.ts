import "reflect-metadata";

import express from "express";
import dotenv from 'dotenv';
import database from './database';
import { WinstonLogger, createLogger } from "./utils/logger";
import { InversifyExpressServer } from "inversify-express-utils";
import container from "./inversify.config";

import './controllers/post.controller';

dotenv.config();
const app = express();



try {
    database.authenticate().catch(e => {
        console.log('Error on database auth', e);
    })
} catch (e) {
    console.log('Error on database auth', e);
}

let server = new InversifyExpressServer(container, null, { rootPath: '/'}, app);

let appConfigured = server.build();

appConfigured.listen(3000, () => {
    console.log('START SERVER');
})
