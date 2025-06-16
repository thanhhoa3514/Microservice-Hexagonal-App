
import { Sequelize } from "sequelize";
import { BaseError } from "../../../../share/model/base-error";
import { Pagination, PaginationSchema } from "../../../../share/model/paging";
import { IRepository } from "../../interface";
import { CategoryConditionDTO, CategoryUpdateDTO } from "../../model/category-dto";
import { Category, CategorySchema } from "../../model/category-model";
import { CategoryStatus } from "../../model/category-enum";
import { CategoryPersistence } from "./category-repo";



export class CategoryRepository implements IRepository {
    constructor(private readonly sequelize: Sequelize, private readonly modelName: string) {
    }
    async getById(id: string): Promise<Category> {
        const category = await this.sequelize.models[this.modelName].findByPk(id);
        if (!category) {
            throw BaseError;
        }
        console.log(category);

        // Transform parentId to parent_id
        const transformedData = {
            ...category.dataValues,
            parent_id: category.dataValues.parentId,
        };
        delete transformedData.parentId;

        return CategorySchema.parse(transformedData);
    }
    async getAll(pagination: Pagination, condition: CategoryConditionDTO): Promise<{ categories: Category[]; pagination: Pagination; }> {
        const { success, data, error } = PaginationSchema.safeParse(condition);
        if (!success) {
            throw BaseError;
        }
        const paginationData = data;
        const offset = (Number(pagination.page) - 1) * Number(pagination.limit);
        const total: number = await CategoryPersistence.count({
            where: {
                status: CategoryStatus.ACTIVE
            }
        });
        const categories = await CategoryPersistence.findAll({
            where: {
                status: CategoryStatus.ACTIVE
            },
            order: [['created_at', 'DESC']],
            offset,
            limit: pagination.limit
        });
        // Transform parentId to parent_id for all categories
        const transformedCategories = categories.map(category => {
            const transformedData = {
                ...category.dataValues,
                parent_id: category.dataValues.parentId,
            };
            delete transformedData.parentId;
            return CategorySchema.parse(transformedData);
        });

        return {
            categories: transformedCategories,
            pagination: paginationData
        }
    }
    async update(id: string, data: CategoryUpdateDTO): Promise<void> {
        await this.sequelize.models[this.modelName].update(data, { where: { id } });
    }
    async delete(id: string): Promise<void> {
        const [affectedRows] = await this.sequelize.models[this.modelName].update(
            { status: CategoryStatus.DELETED },
            { where: { id } }
        );

        if (affectedRows === 0) {
            throw BaseError;
        }
    }
    async insert(data: Category): Promise<void> {
        // Transform parent_id to parentId for database
        const insertData = {
            ...data,
            parentId: data.parent_id,
        };
        delete insertData.parent_id;

        await this.sequelize.models[this.modelName].create(insertData);
    }
}