import { IQueryHandler, IQueryRepository } from "../../../share/interface";
import { Pagination } from "../../../share/model/paging";
import { ListProductQuery } from "../interface";
import { Product } from "../model/product-model";
import { ProductConditionDTO } from "../model/product.dto";

export class ListProductQueryHandler implements IQueryHandler<ListProductQuery, { products: Product[], pagination: Pagination }> {
    constructor(private readonly productRepository: IQueryRepository<Product, ProductConditionDTO>) {
    }

    async execute(query: ListProductQuery): Promise<{ products: Product[], pagination: Pagination }> {
        const { entities, pagination } = await this.productRepository.getAll(query.pagination, query.condition);
        return { products: entities as Product[], pagination };
    }
}