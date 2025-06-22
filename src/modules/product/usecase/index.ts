import { IProductUseCase } from "../interface";
import { ProductRepositorySequelize } from "../infras/repository/mysql/product-repos-sequelize";
import { ProductConditionDTO, ProductCreateDTO, ProductUpdateDTO } from "../model/product.dto";
import { Pagination } from "@share/model/paging";
import { Product } from "../model/product-model";
import { ProductStatus } from "../model/product-enum";
import { v7 } from "uuid";

export class ProductUseCase implements IProductUseCase {
    constructor(readonly repository: ProductRepositorySequelize) {
    }

    // Required by IUseCase interface
    async create(data: ProductCreateDTO): Promise<Product> {
        const id = v7();
        const product: Product = {
            id,
            ...data,
            status: ProductStatus.ACTIVE,
            createdAt: new Date(),
            updatedAt: new Date()
        };
        await this.repository.insert(product);
        return product;
    }

    async insert(data: ProductCreateDTO): Promise<string> {
        const id = v7();
        const product: Product = {
            id,
            ...data,
            status: ProductStatus.ACTIVE,
            createdAt: new Date(),
            updatedAt: new Date()
        };
        await this.repository.insert(product);
        return id;
    }
    async update(id: string, data: ProductUpdateDTO): Promise<Product> {
        await this.repository.update(id, data);
        return await this.repository.getById(id);
    }
    async delete(id: string): Promise<void> {
        return await this.repository.delete(id);
    }
    async execute(query: { pagination: Pagination, condition: ProductConditionDTO }): Promise<{ entities: Product[], pagination: Pagination }> {
        return await this.repository.getAll(query.pagination, query.condition);
    }
    async getById(id: string): Promise<Product> {
        return await this.repository.getById(id);
    }
}