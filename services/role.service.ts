import { ILogger } from "./../interfaces/index";
import { RoleRepository } from "./../domain/role.repo";
import { inject, injectable } from "inversify";
import { Service } from ".";
import { loggerInstance } from "../utils/logger";
import TYPES from "../types";
import { Role } from "../database/initTables";

@injectable()
export class RoleService extends Service {
  constructor(
    @inject(TYPES.RoleRepository) public repository: RoleRepository,
    @inject(TYPES.ILogger) loggerInstance: ILogger
  ) {
    super(loggerInstance);
  }
  async getAll(): Promise<Array<Role>> {
    return await this.repository.getFullList();
  }
  async getRole(uuid: string): Promise<Role | undefined> {
    try {
      return await this.repository.get(uuid);
    } catch (err) {
      loggerInstance.error(`Error in getRole method: ${err}`);
      return undefined;
    }
  }
}
