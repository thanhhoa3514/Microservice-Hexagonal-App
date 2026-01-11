import { CartItem, Product } from "@modules/order/model/order.model";
import { ICartQueryRepository, IProductQueryRepository } from "@modules/order/interface";
import axios from "axios";



export class OrderGRPCCartQueryRepository implements ICartQueryRepository {
    constructor(private readonly baseUrl: string) { }
    async listItems(userId: string): Promise<CartItem[]> {
        const response = await axios.post(`${this.baseUrl}/v1/grpc/carts/items`, { userId });
        return response.data;
    }
    async clearItems(userId: string): Promise<void> {
        await axios.delete(`${this.baseUrl}/v1/grpc/carts/items?userId=${userId}`);
    }
}

export class OrderGRPCProductQueryRepository implements IProductQueryRepository {
    constructor(private readonly baseUrl: string) { }
    async findByIds(ids: string[]): Promise<Product[]> {
        const response = await axios.post(`${this.baseUrl}/v1/grpc/products/find-by-ids`, { ids });
        return response.data;
    }
}