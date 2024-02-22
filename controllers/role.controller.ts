import { ILogger } from "./../interfaces/index";
import { inject } from "inversify";
import {
  controller,
  httpGet,
  interfaces,
  request,
  response,
} from "inversify-express-utils";
import TYPES from "../types";
import { Request, Response } from "express";
import { RoleService } from "../services/role.service";

@controller("/role")
export class RoleController implements interfaces.Controller {
  constructor(
    @inject(TYPES.ILogger) public loggerInstance: ILogger,
    @inject(TYPES.RoleService) public service: RoleService
  ) {}

  @httpGet("/:uuid")
  public async getRole(@request() req: Request, @response() res: Response) {
    try {
      const { params } = req;
      if (!params || params.uuid) {
       throw new Error('Uuid is not set');
      }
      const result = await this.service.getRole(params.uuid);
      res.status(200).json(result);
    } catch (err) {
      this.loggerInstance.error(`Error in getRole action: ${err}`);
      res.status(500).json({
        err,
      });
    }
  }

  @httpGet('/')
  public async getAll(@request() req: Request, @response() res: Response) {
   try {
    const result = await this.service.getAll();
    res.status(200).json(result);
   } catch (err) {
    this.loggerInstance.error(`Error in action getAll: ${err}`);
    res.status(500).json();
   }
  }
}
