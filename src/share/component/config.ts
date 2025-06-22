import dotenv from "dotenv";
dotenv.config();
export const config = {
    rpc: {
        product: {
            baseURL: process.env.PRODUCT_RPC_BASE_URL,
        },
        category: {
            baseURL: process.env.CATEGORY_RPC_BASE_URL,
        }
    }
}