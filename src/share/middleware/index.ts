import { ITokenIntrospect } from "../interface";
import { checkRole } from "./checkrole";
import { authMiddleware } from "./auth";
import { MdlFactory } from "../interface/service-context";


export const setUpMiddleware =
    (inspector: ITokenIntrospect): MdlFactory => {
        const auth = authMiddleware(inspector);

        return {
            authMiddleware: auth,
            checkRole
        }
    }