import { ProductBrandDTO, ProductBrandDTOSchema, ProductCategoryDTO, ProductCategoryDTOSchema } from "@modules/product/model/product-model";
import { IBrandQueryRepository, IProductCategoryQueryRepository } from "@modules/product/interface";
import axios from "axios";

export class RPCProductBrandRepository implements IBrandQueryRepository {
    constructor(private readonly baseURL: string) {

    }
    async get(id: string): Promise<ProductBrandDTO | null> {
        try {
            const response = await axios.get(`${this.baseURL}/v1/brands/${id}`);
            const data = ProductBrandDTOSchema.parse(response.data.data);
            return data;

        } catch (error) {
            console.error(error);
            return null;
        }
    }
    async findAll(): Promise<ProductBrandDTO[]> {
        return [];
    }

}
export class RPCProductCategoryRepository implements IProductCategoryQueryRepository {
    constructor(private readonly baseURL: string) { }
    async get(id: string): Promise<ProductCategoryDTO | null> {
        try {
            const response = await axios.get(`${this.baseURL}/v1/categories/${id}`);
            const data = ProductCategoryDTOSchema.parse(response.data.data);
            return data;
        } catch (error) {
            console.error(error);
            return null;
        }
    }
    async findAll(): Promise<ProductCategoryDTO[]> {
        return [];
    }
}

// proxy design pattern, if we want to add redis cache, simply add cache to the constructor like redis client
export class ProxyProductBrandRepository implements IBrandQueryRepository {
    constructor(private readonly origin: IBrandQueryRepository) { }
    private cache: Record<string, ProductBrandDTO> = {};
    async get(id: string): Promise<ProductBrandDTO | null> {
        if (this.cache[id]) {
            return this.cache[id];
        }
        const data = await this.origin.get(id);
        if (data) {
            this.cache[id] = data;
        }
        return data;
    }
    async findAll(): Promise<ProductBrandDTO[]> {
        return this.origin.findAll();
    }

}