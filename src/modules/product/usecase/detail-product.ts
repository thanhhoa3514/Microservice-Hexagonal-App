import { GetDetailProductQuery, IProductRepository } from "../interface";
import { Product } from "../model/product-model";
import { IQueryHandler } from "../../../share/interface";
import { ProductDeleteForbiddenError, ProductNotFoundError } from "../model/product-error";
import { IQueryRepository } from "../../../share/interface";
import { ProductConditionDTO } from "../model/product.dto";
import { ProductStatus } from "../model/product-enum";


export class GetProductDetailQueryHandler implements IQueryHandler<GetDetailProductQuery, Product> {
    constructor(private readonly productRepository: IQueryRepository<Product, ProductConditionDTO>) {
    }

    async execute(query: GetDetailProductQuery): Promise<Product> {
        const product = await this.productRepository.getById(query.id);
        if (!product) {
            throw new ProductNotFoundError(query.id);
        }
        if (product.status === ProductStatus.DELETED) {
            throw new ProductDeleteForbiddenError(query.id, "Product is deleted");
        }
        return product;
    }
}