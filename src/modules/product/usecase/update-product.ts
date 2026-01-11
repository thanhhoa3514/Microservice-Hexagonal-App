import { IProductRepository, UpdateCommand } from "../interface";
import {
  ProductDeleteForbiddenError,
  ProductNotFoundError,
} from "../model/product-error";

import { ProductStatus } from "../model/product-enum";
import { ICreateNewBrandCommandHandler } from "../../../share/interface";
import { ICacheService } from "@share/interface/cache";

export class UpdateProductCommandHandler
  implements ICreateNewBrandCommandHandler<UpdateCommand, void>
{
  constructor(
    private readonly productRepository: IProductRepository,
    private readonly cacheService: ICacheService
  ) {}

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
      if (
        error instanceof ProductNotFoundError ||
        error instanceof ProductDeleteForbiddenError
      ) {
        throw error;
      }
      throw new ProductNotFoundError(data.id);
    }
    // Thực hiện update
    await this.productRepository.update(data.id, data.cmd);

    // 3. Xóa cache sau khi update thành công
    console.log(
      `[CACHE INVALIDATION] Product ${data.id} updated. Deleting cache.`
    );

    // Xóa cache chi tiết sản phẩm
    const detailCacheKey = `product:${data.id}`;
    await this.cacheService.delete(detailCacheKey);

    // Xóa cache của các danh sách sản phẩm
    await this.cacheService.deleteByPattern("products:*");

    console.log(
      `[CACHE INVALIDATION] Cache for product ${data.id} and product lists deleted.`
    );
  }
}
