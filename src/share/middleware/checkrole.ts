import { ErrForbidden, ErrUnauthorized, responseError } from "../app-error";
import { Requester } from "../interface";
import { UserRole } from "../model/mode-status";
import { Handler, NextFunction, Request, Response } from "express";

export function checkRole(role: UserRole[]): Handler {
    return (req: Request, res: Response, next: NextFunction) => {

        if (!res.locals['requester']) {
            responseError(res, ErrUnauthorized);
            return;
        }

        const requester = res.locals['requester'] as Requester;

        if (role.indexOf(requester.role.toUpperCase() as UserRole) === -1) {
            responseError(res, ErrForbidden.withLog('This user does not have permission to access this resource'));
            return;
        }
        next();
    }
}