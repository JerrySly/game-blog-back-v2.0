import { controller, httpPost, interfaces, request, response  } from "inversify-express-utils";
import TYPES from "../types";
import { ILogger } from "../interfaces";
import { inject } from "inversify";
import { Request, Response } from "express";
import upload from "../utils/multer";

@controller('/image')
export class ImageController implements interfaces.Controller {
    constructor(@inject(TYPES.ILogger) public loggerInstance: ILogger) {}


    @httpPost('/single', upload.single('image'))
    public async saveSingleImage(@request() req: Request, @response() res: Response) {
        if (req.file) {
            res.status(200).json('Success')
        } else {
            res.status(400).json('Invalid image file')
        }
    }

    @httpPost('/multiple', upload.array('images'))
    public async saveMultiplyImages(@request() req: Request, @response() res: Response) {
        if (req.files) {
            res.status(200).json('Success')
        } else {
            res.status(400).json('Invalid image files')
        }
    }
}