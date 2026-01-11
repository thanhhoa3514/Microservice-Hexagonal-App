import { BaseError } from "../../../share/model/base-error";
import { Pagination } from "../../../share/model/paging";
import { ICategoryUseCase, IRepository } from "../interface";
import {
  CategoryConditionDTO,
  CategoryCreateDTO,
  CategoryUpdateDTO,
} from "../model/category-dto";
import { CategoryStatus } from "../model/category-enum";
import { Category } from "../model/category-model";
import { v7 } from "uuid";
import { createHash } from "crypto";
import { ICacheService } from "@share/interface/cache";
const createListCacheKey = (
  pagination: Pagination,
  condition: CategoryConditionDTO
): string => {
  const sortedCondition = Object.keys(condition)
    .sort()
    .reduce((obj, key) => {
      obj[key] = condition[key];
      return obj;
    }, {});
  const paramsString = JSON.stringify({
    pagination,
    condition: sortedCondition,
  });
  const hash = createHash("md5").update(paramsString).digest("hex");
  return `categories:${hash}`;
};
export class CategoryUseCase implements ICategoryUseCase {
  private readonly CACHE_TTL_SECONDS = 86400;
  constructor(
    private readonly repository: IRepository,
    private readonly cacheService: ICacheService
  ) {}
  async deleteCategory(id: string): Promise<void> {
    const category = await this.repository.getById(id);
    if (!category) {
      throw BaseError;
    }
    if (category.status === CategoryStatus.DELETED) {
      // Category already deleted, return success (idempotent)
      return;
    }
    await this.repository.delete(id);
    await this.cacheService.delete(`category:${id}`);
    await this.cacheService.deleteByPattern("categories:*");
  }
  async getDetailCategory(id: string): Promise<Category> {
    const cacheKey = `category:${id}`;
    const cachedCategory = await this.cacheService.get<Category>(cacheKey);
    if (cachedCategory) {
      return cachedCategory;
    }
    const data = await this.repository.getById(id);
    if (!data || data.status === CategoryStatus.DELETED) {
      throw BaseError;
    }
    await this.cacheService.set(cacheKey, data, this.CACHE_TTL_SECONDS);
    return data;
  }
  async listCategory(
    pagination: Pagination,
    condition: CategoryConditionDTO
  ): Promise<{ categories: Category[]; pagination: Pagination }> {
    const cacheKey = createListCacheKey(pagination, condition);
    const cachedResult = await this.cacheService.get<{
      categories: Category[];
      pagination: Pagination;
    }>(cacheKey);
    if (cachedResult) {
      return cachedResult;
    }

    const result = await this.repository.getAll(pagination, condition);
    await this.cacheService.set(cacheKey, result, this.CACHE_TTL_SECONDS);
    return result;
  }

  async createNewCategory(data: CategoryCreateDTO): Promise<string> {
    const id = v7();
    const category: Category = {
      id: id,
      name: data.name,
      image: data.image,
      description: data.description,
      parent_id: data.parentId,
      position: data.position || 0,
      status: CategoryStatus.ACTIVE,
      created_at: new Date(),
      updated_at: new Date(),
    };
    await this.repository.insert(category);
    await this.cacheService.deleteByPattern("categories:*");
    return id;
  }

  async updateCategory(id: string, data: CategoryUpdateDTO): Promise<void> {
    const category = await this.repository.getById(id);
    if (!category || category.status === CategoryStatus.DELETED) {
      throw BaseError;
    }
    await this.repository.update(id, data);
    await this.cacheService.delete(`category:${id}`);
    await this.cacheService.deleteByPattern("categories:*");
    return;
  }
  async findAll(ids: string[]): Promise<Category[]> {
    return this.repository.findAll(ids);
  }
}
