import { Pagination } from "../../../share/model/paging";
import { CategoryConditionDTO, CategoryCreateDTO, CategoryUpdateDTO } from "../model/category-dto";
import { Category } from "../model/category-model";

export interface ICategoryUseCase {
    createNewCategory(data: CategoryCreateDTO): Promise<string>;
    updateCategory(id: string, data: CategoryUpdateDTO): Promise<void>;
    deleteCategory(id: string): Promise<void>;
    getDetailCategory(id: string): Promise<Category>;
    listCategory(pagination: Pagination, condition: CategoryConditionDTO): Promise<{ categories: Category[], pagination: Pagination }>;
    findAll(ids: string[]): Promise<Category[]>;
}

export interface IRepository extends IQueryRepository, ICommandRepository {

}
export interface IQueryRepository {
    getById(id: string): Promise<Category>;
    getAll(pagination: Pagination, condition: CategoryConditionDTO): Promise<{ categories: Category[], pagination: Pagination }>;
}

export interface ICommandRepository {
    update(id: string, data: CategoryUpdateDTO): Promise<void>;
    delete(id: string): Promise<void>;
    insert(data: Category): Promise<void>;
    findAll(ids: string[]): Promise<Category[]>;
}