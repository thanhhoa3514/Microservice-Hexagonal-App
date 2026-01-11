import { CartExternalServiceError, CartProductNotFoundError } from "@modules/cart/model/cart-error";
import { ICartQueryRepository, IProductQueryRepository } from "@modules/cart/interface";

import { CartItemDTO, CartProductDTO } from "@modules/cart/model/cart-model";
import axios, { AxiosError } from "axios";
import { AppError } from "@share/app-error";


export class RPCCartProductRepository implements IProductQueryRepository {
    constructor(private readonly baseURL: string) {
    }
    async getBy(id: string): Promise<CartProductDTO | null> {
        try {
            const result = await axios.get(`${this.baseURL}/v1/products/${id}`);

            if (!result.data.data) {
                throw new CartProductNotFoundError(id);
            }
            const product = result.data.data;
            // Convert product to CartProductDTO
            return this.transformProduct(product);
        } catch (error) {
            throw AppError.from(error as Error, 500);
        }

    }
    async getByIds(ids: string[]): Promise<CartProductDTO[]> {
        const result = await axios.post(`${this.baseURL}/v1/products/ids`, { params: { ids } });
        const products = result.data.data;
        // Convert products to CartProductDTO
        return products.map((product: any) => this.transformProduct(product));
    }
    private transformProduct(product: any): CartProductDTO {
        return {
            id: product.id,
            name: product.name,
            images: product.images,
            price: product.price,
            salePrice: product.salePrice,
            quantity: product.quantity,
        }
    }

}


// export class ProxyCartProductRepository implements ICartQueryRepository {
//     constructor(private readonly origin: ICartQueryRepository) { }
//     private cache: Record<string, > = {};
//     async get(id: string): Promise< | null> {
//         if (this.cache[id]) {
//             return this.cache[id];
//         }
//         const data = await this.origin.get(id);
//         if (data) {
//             this.cache[id] = data;
//         }
//         return data;
//     }
//     async findAll(): Promise<[]> {
//         return this.origin.findAll();
//     }

// }