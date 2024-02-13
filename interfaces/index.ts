import { injectable } from "inversify";

@injectable()
export class ILogger {
    log: (message: string) => void; 
    error: (message: string) => void; 
}
