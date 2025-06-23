import { ITokenIntrospect, TokenIntrospectResult } from "../interface";
import axios from "axios";
import { UserRole } from "../model/mode-status";


export class TokenIntrospectRpcClient implements ITokenIntrospect {
    constructor(readonly url: string) {

    }
    async introspect(token: string): Promise<TokenIntrospectResult> {
        try {

            const { data } = await axios.post(`${this.url}`, { token });
            const { sub, role } = data.data.payload;
            return {
                payload: { sub, role },
                isOk: data.data.isOk
            };
        } catch (error) {
            return {
                payload: { sub: "", role: UserRole.USER },
                error: (error as Error).message,
                isOk: false
            };
        }
    }
}