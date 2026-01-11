import { GetDetailProductQuery, IProductRepository } from "../interface";
import { Product } from "../model/product-model";
import { IQueryHandler } from "../../../share/interface";
import {
  ProductDeleteForbiddenError,
  ProductNotFoundError,
} from "../model/product-error";
import { IQueryRepository } from "../../../share/interface";
import { ProductConditionDTO } from "../model/product.dto";
import { ProductStatus } from "../model/product-enum";
import { ICacheService } from "@share/interface/cache";

export class GetProductDetailQueryHandler
  implements IQueryHandler<GetDetailProductQuery, Product>
{
  constructor(
    private readonly productRepository: IQueryRepository<
      Product,
      ProductConditionDTO
    >,
    private readonly cacheService: ICacheService
  ) {}

  async execute(query: GetDetailProductQuery): Promise<Product> {
    const cacheKey = `product:${query.id}`;
    const CACHE_TTL_SECONDS = 3600;
    // 4. Kiểm tra cache trước
    const cachedProduct = await this.cacheService.get<Product>(cacheKey);
    if (cachedProduct) {
      console.log(`[CACHE HIT] Found product ${query.id} in cache.`);
      // Quan trọng: Vẫn phải kiểm tra status trên dữ liệu cache
      if (cachedProduct.status === ProductStatus.DELETED) {
        throw new ProductDeleteForbiddenError(query.id, "Product is deleted");
      }
      return cachedProduct;
    }

    console.log(
      `[CACHE MISS] Product ${query.id} not in cache. Fetching from DB.`
    );
    const product = await this.productRepository.getById(query.id);
    if (!product) {
      throw new ProductNotFoundError(query.id);
    }
    if (product.status === ProductStatus.DELETED) {
      throw new ProductDeleteForbiddenError(query.id, "Product is deleted");
    }
    // 6. Lưu vào cache trước khi trả về
    await this.cacheService.set(cacheKey, product, CACHE_TTL_SECONDS);
    console.log(`[CACHE SET] Stored product ${query.id} in cache.`);
    return product;
  }
}
