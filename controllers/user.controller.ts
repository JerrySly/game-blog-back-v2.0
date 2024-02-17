import { controller, interfaces } from "inversify-express-utils";

@controller('/user')
export class  UserController implements interfaces.Controller {
    
}