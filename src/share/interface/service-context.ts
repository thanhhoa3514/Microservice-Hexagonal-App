import { Handler } from "express";
import { UserRole } from "../model/mode-status";


export interface MdlFactory {
    authMiddleware: Handler;
    checkRole: (role: UserRole[]) => Handler;
}
export type ServiceContext = {
    mdlFactory: MdlFactory;
}