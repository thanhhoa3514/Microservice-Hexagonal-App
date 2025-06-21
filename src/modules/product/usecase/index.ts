import { IProductUseCase } from "../interface";
import { ProductRepositorySequelize } from "../infras/repository/mysql/product-repos-sequelize";
import { ProductConditionDTO, ProductCreateDTO, ProductUpdateDTO } from "../model/product.dto";
import { Pagination } from "@share/model/paging";
import { Product } from "../model/product-model";

export class ProductUseCase implements IProductUseCase {
    constructor(readonly repository: ProductRepositorySequelize) {
    }
    async insert(data: ProductCreateDTO): Promise<void> {
        return await this.repository.insert(data as Product);
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