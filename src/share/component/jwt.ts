import { ITokenProvider, TokenPayLoad } from "@share/interface";
import jwt from "jsonwebtoken";
import { config } from "./config";

export class JWTTokenService implements ITokenProvider {
    private readonly secretKey: string;
    private readonly expiresIn: string;
    constructor(secretKey: string, expiresIn: string) {
        this.secretKey = secretKey;
        this.expiresIn = expiresIn;
    }
    async generateToken(payload: TokenPayLoad): Promise<string> {
        return jwt.sign(payload, this.secretKey, {
            expiresIn: this.expiresIn as any
        });
    }
    async verifyToken(token: string): Promise<TokenPayLoad | null> {
        try {
            const decoded = jwt.verify(token, this.secretKey) as TokenPayLoad;
            return decoded;
        } catch (error) {
            // Handle JWT errors (expired, invalid, malformed, etc.)
            console.error('JWT verification error:', error);
            return null;
        }
    }
}
export const JWTTokenServiceFactory = new JWTTokenService(config.jwt.secretKey as string, config.jwt.expiresIn as string);