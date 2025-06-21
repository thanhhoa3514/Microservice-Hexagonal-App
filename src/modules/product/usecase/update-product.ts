import { IProductRepository, UpdateCommand } from "../interface";
import { ProductDeleteForbiddenError, ProductNotFoundError } from "../model/product-error";

import { ProductStatus } from "../model/product-enum";
import { ICreateNewBrandCommandHandler } from "../../../share/interface";

export class UpdateProductCommandHandler implements ICreateNewBrandCommandHandler<UpdateCommand, void> {
    constructor(private readonly productRepository: IProductRepository) {
    }

    async execute(data: UpdateCommand): Promise<void> {
        try {
            const product = await this.productRepository.getById(data.id);
            if (!product) {
                throw new ProductNotFoundError(data.id);
            }
            if (product.status === ProductStatus.DELETED) {
                throw new ProductDeleteForbiddenError(data.id, "Product is deleted");
            }

            await this.productRepository.update(data.id, data.cmd);
            return;
        } catch (error) {
            if (error instanceof ProductNotFoundError || error instanceof ProductDeleteForbiddenError) {
                throw error;
            }
            throw new ProductNotFoundError(data.id);
        }
    }

} 