import { BaseError } from "../../../share/model/base-error";
import { Pagination } from "../../../share/model/paging";
import { ICategoryUseCase, IRepository } from "../interface";
import { CategoryConditionDTO, CategoryCreateDTO, CategoryUpdateDTO } from "../model/category-dto";
import { CategoryStatus } from "../model/category-enum";
import { Category } from "../model/category-model";
import { v7 } from "uuid";

export class CategoryUseCase implements ICategoryUseCase {
    constructor(private readonly repository: IRepository) {
    }
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
    }
    async getDetailCategory(id: string): Promise<Category> {

        const data = await this.repository.getById(id);
        if (!data || data.status === CategoryStatus.DELETED) {
            throw BaseError;
        }
        return data;
    }
    async listCategory(pagination: Pagination, condition: CategoryConditionDTO): Promise<{ categories: Category[]; pagination: Pagination; }> {
        return await this.repository.getAll(pagination, condition);
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
            updated_at: new Date()
        }
        await this.repository.insert(category);
        return id;
    }

    async updateCategory(id: string, data: CategoryUpdateDTO): Promise<void> {
        const category = await this.repository.getById(id);
        if (!category || category.status === CategoryStatus.DELETED) {
            throw BaseError;
        }
        await this.repository.update(id, data);
        return;
    }
}