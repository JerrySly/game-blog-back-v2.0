import { injectable } from 'inversify';
import { ILogger } from './../interfaces/index';
import winston from "winston";

export let loggerInstance: winston.Logger;

export function createLogger () {
  if (loggerInstance) return loggerInstance;
  const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    defaultMeta: {service: 'user-service'},
    transports: [
      new winston.transports.File({ filename: 'error.log', level: 'error'}),
      new winston.transports.File({ filename: 'combine.log'}),
    ]
  })

  if (process.env.NODE_ENV !== 'production') {
    logger.add( new winston.transports.Console({
      format: winston.format.simple(),
    }));
  }
  loggerInstance  = logger;
  return logger;
}

@injectable()
export class WinstonLogger implements ILogger {
  logger: winston.Logger;
  constructor() {
    this.logger = createLogger();
  }
  log (message: string) {
    this.logger.info(message);
  };
  error(message: string) {
    this.logger.error(message);
  };

}
