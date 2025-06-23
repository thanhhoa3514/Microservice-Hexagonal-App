import { Handler, NextFunction, Request, Response } from "express";
import { ITokenIntrospect, Requester } from "../interface";


export function authMiddleware(

    introspect: ITokenIntrospect,
): Handler {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            // get token from header
            const token = req.headers.authorization?.split(" ")[1];
            if (!token) {
                res.status(401).json({ message: "Unauthorized" });
                return;
            }
            // verify token
            const { payload, error, isOk } = await introspect.introspect(token);
            if (!isOk) {
                res.status(401).json({ message: error });
                return;
            }
            // get user from database
            const requester: Requester = payload;
            // set user to request
            res.locals['requester'] = requester;
            next();
        } catch (error) {
            res.status(401).json({ message: "Unauthorized" });
        }
    }
}