import dotenv from "dotenv";
dotenv.config();
export const config = {
    rpc: {
        product: {
            baseURL: process.env.PRODUCT_RPC_BASE_URL,
        },
        category: {
            baseURL: process.env.CATEGORY_RPC_BASE_URL,
        },
        cart: {
            baseURL: process.env.CART_RPC_BASE_URL,
        },
        order: {
            baseURL: process.env.ORDER_RPC_BASE_URL,
        }
    },
    jwt: {
        secretKey: process.env.JWT_SECRET_KEY as string,
        expiresIn: process.env.JWT_EXPIRES_IN as string,
        refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN as string
    }
}