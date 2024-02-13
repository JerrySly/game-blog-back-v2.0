import { NextFunction, Request, Response } from "express";

type ExpressRouteFunc = (req: Request, res: Response, next?: NextFunction) => void | Promise<void>;