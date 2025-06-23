import { Handler, NextFunction, Request, Response } from "express";
import { IQueryRepository, ITokenIntrospect, ITokenProvider, Requester } from "../interface";
import { UserDTO } from "@modules/user/model/user.model";
import { UserRole, UserStatus } from "../model/mode-status";

export function authMiddleware(
    userRepo: IQueryRepository<UserDTO, any>,
    tokenProvider: ITokenProvider
): Handler {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            // // get token from header
            // const token = req.headers.authorization?.split(" ")[1];
            // if (!token) {
            //     return res.status(401).json({ message: "Unauthorized" });
            // }
            // // verify token
            // const payload = await tokenProvider.verifyToken(token) as Requester;
            // // get user from database
            // const user = await userRepo.getById(payload.sub);
            // if (!user) {
            //     return res.status(401).json({ message: "Unauthorized" });
            // }
            // // set user to request
            // const { status, role, id: userId } = user;
            // if (status === UserStatus.INACTIVE || status === UserStatus.DELETED || status === UserStatus.BANNED) {
            //     return res.status(401).json({ message: "Unauthorized" });
            // }
            // if (role === UserRole.USER) {
            //     return res.status(403).json({ message: "Forbidden" });
            // }
            // // set user to request
            // res.locals['requester'] = { userId, role };
            return next();
        } catch (error) {
            res.status(500).json({ message: (error as Error).message });
            return;
        }

    }
}

