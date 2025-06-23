import { IBrandQueryRepository, IProductCategoryQueryRepository, IProductUseCase } from "../interface";
import { ProductRepositorySequelize } from "../infras/repository/mysql/product-repos-sequelize";
import { ProductConditionDTO, ProductCreateDTO, ProductUpdateDTO } from "../model/product.dto";
import { Pagination } from "@share/model/paging";
import { Product } from "../model/product-model";
import { ProductStatus } from "../model/product-enum";
import { v7 } from "uuid";
import { ProductBrandNotExistsError, ProductCategoryNotExistsError } from "../model/product-error";

export class ProductUseCase implements IProductUseCase {
    constructor(
        readonly repository: ProductRepositorySequelize,
        readonly rpcProductBrandRepository: IBrandQueryRepository,
        readonly rpcProductCategoryRepository: IProductCategoryQueryRepository
    ) {
    }

    // Required by IUseCase interface
    async create(data: ProductCreateDTO): Promise<Product> {

        const brand = await this.rpcProductBrandRepository.get(data.brandId!);
        if (!brand) {
            throw new ProductBrandNotExistsError(data.brandId!);
        }
        const category = await this.rpcProductCategoryRepository.get(data.categoryId!);
        if (!category) {
            throw new ProductCategoryNotExistsError(data.categoryId!);
        }
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
        const brand = await this.rpcProductBrandRepository.get(data.brandId!);
        if (!brand) {
            throw new ProductBrandNotExistsError(data.brandId!);
        }
        const category = await this.rpcProductCategoryRepository.get(data.categoryId!);
        if (!category) {
            throw new ProductCategoryNotExistsError(data.categoryId!);
        }
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
    async update(id: string, data: ProductUpdateDTO): Promise<void> {
        await this.repository.update(id, data);
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