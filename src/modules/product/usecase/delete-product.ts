import { DeleteCommand, IProductRepository } from "../interface";
import { ProductDeleteForbiddenError, ProductNotFoundError } from "../model/product-error";

import { ProductStatus } from "../model/product-enum";
import { ICommandHandler } from "../../../share/interface";

export class DeleteProductCommandHandler implements ICommandHandler<DeleteCommand, void> {
    constructor(private readonly productRepository: IProductRepository) {
    }

    async execute(data: DeleteCommand): Promise<void> {
        try {
            const product = await this.productRepository.getById(data.id);
            if (!product) {
                throw new ProductNotFoundError(data.id);
            }
            if (product.status === ProductStatus.DELETED) {
                throw new ProductDeleteForbiddenError(data.id, "Product is deleted");
            }

            await this.productRepository.delete(data.id);
            return;
        } catch (error) {
            if (error instanceof ProductNotFoundError || error instanceof ProductDeleteForbiddenError) {
                throw error;
            }
            throw new ProductNotFoundError(data.id);
        }
    }

} 