import { ICacheService } from "@share/interface/cache";
import { IQueryHandler, IQueryRepository } from "../../../share/interface";
import { Pagination } from "../../../share/model/paging";
import { ListProductQuery } from "../interface";
import { Product } from "../model/product-model";
import { ProductConditionDTO } from "../model/product.dto";
import { createHash } from "crypto";
type ListProductResult = { products: Product[]; pagination: Pagination };
export class ListProductQueryHandler
  implements
    IQueryHandler<
      ListProductQuery,
      { products: Product[]; pagination: Pagination }
    >
{
  constructor(
    private readonly productRepository: IQueryRepository<
      Product,
      ProductConditionDTO
    >,
    private readonly cacheService: ICacheService
  ) {}
  private createCacheKey(query: ListProductQuery): string {
    // Sắp xếp key để đảm bảo tính nhất quán
    const sortedQuery = {
      pagination: query.pagination,
      condition: Object.keys(query.condition)
        .sort()
        .reduce((obj, key) => {
          obj[key] = query.condition[key] as any;
          return obj;
        }, {}),
    };
    const queryString = JSON.stringify(sortedQuery);
    const hash = createHash("md5").update(queryString).digest("hex");
    return `products:${hash}`;
  }
  async execute(query: ListProductQuery): Promise<ListProductResult> {
    // 4. Tạo và định nghĩa cache key/TTL
    const cacheKey = this.createCacheKey(query);
    const CACHE_TTL_SECONDS = 600; // 10 phút

    // 5. Kiểm tra cache
    const cachedResult = await this.cacheService.get<ListProductResult>(
      cacheKey
    );
    if (cachedResult) {
      console.log(
        `[CACHE HIT] Found product list for key ${cacheKey} in cache.`
      );
      return cachedResult;
    }

    console.log(
      `[CACHE MISS] Product list for key ${cacheKey} not in cache. Fetching from DB.`
    );
    // 6. Cache miss, lấy từ DB
    const { entities, pagination } = await this.productRepository.getAll(
      query.pagination,
      query.condition
    );
    const result = { products: entities as Product[], pagination };

    // 7. Lưu vào cache trước khi trả về
    await this.cacheService.set(cacheKey, result, CACHE_TTL_SECONDS);
    console.log(
      `[CACHE SET] Stored product list for key ${cacheKey} in cache.`
    );

    return result;
  }
}
