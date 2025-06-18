import { Request, Response } from "express";
import { CategoryCreateDTO, CategoryCreateDTOSchema, CategoryUpdateDTO, CategoryUpdateDTOSchema } from "../../model/category-dto";

import { ICategoryUseCase } from "../../interface";
import { PaginationSchema } from "../../../../share/model/paging";
import { CategoryStatus } from "../../model/category-enum";
import { Category } from "../../model/category-model";

export class CategoryHttpService {
    constructor(private readonly useCase: ICategoryUseCase) {
    }

    async createNewCategoryAPI(req: Request, res: Response): Promise<void> {
        const { success, data, error } = CategoryCreateDTOSchema.safeParse(req.body);
        if (!success) {
            res.status(400).json({
                message: "Invalid request body",
                error: error.message
            });
            return;
        }
        const id = await this.useCase.createNewCategory(data);
        res.status(201).json({
            message: "Category created successfully",
            data: {
                id
            }
        });
    }
    async listCategoryAPI(req: Request, res: Response): Promise<void> {
        const { success, data, error } = PaginationSchema.safeParse(req.query);
        if (!success) {
            res.status(400).json({
                message: "Invalid request body",
                error: error.message
            });
            return;
        }
        const { categories, pagination } = await this.useCase.listCategory(data, req.query);
        const categoryTree = this.buildCategoryTree(categories);
        res.status(200).json({
            message: "Categories listed successfully",
            data: {
                categories: categoryTree,
                pagination
            }
        });
    }
    async getDetailCategoryAPI(req: Request, res: Response): Promise<void> {
        const { id } = req.params;
        const category = await this.useCase.getDetailCategory(id);
        if (!category) {
            res.status(404).json({
                message: "Category not found",
            });
            return;
        }
        if (category.status === CategoryStatus.DELETED) {
            res.status(404).json({
                message: "Category deleted",
            });
            return;
        }
        res.status(200).json({
            message: "Category retrieved successfully",
            data: category
        });
    }
    async updateCategoryAPI(req: Request, res: Response): Promise<void> {
        const { id } = req.params;
        const { success, data, error } = CategoryUpdateDTOSchema.safeParse(req.body);
        if (!success) {
            res.status(400).json({
                message: "Invalid request body",
                error: error.message
            });
            return;
        }
        await this.useCase.updateCategory(id, data);
        res.status(200).json({
            message: "Category updated successfully",
        });
    }
    async deleteCategoryAPI(req: Request, res: Response): Promise<void> {
        const { id } = req.params;
        try {
            await this.useCase.deleteCategory(id);
            res.status(200).json({
                message: "Category deleted successfully",
            });
        } catch (error) {
            res.status(400).json({
                message: "Category not found",
                error: error
            });
        }
    }
    private buildCategoryTree(categories: Category[]): Category[] {
        if (!categories || categories.length === 0) {
            return [];
        }
        const roots: Category[] = [];
        const categoryMap = new Map<string, Category[]>();
        for (let i = 0; i < categories.length; i++) {
            const category = categories[i];
            if (!categoryMap.get(category.id)) {
                categoryMap.set(category.id, []);
            }
            category.children = categoryMap.get(category.id);
            if (!category.parent_id) {
                roots.push(category);
            } else {
                const parent = categoryMap.get(category.parent_id);
                parent ? parent.push(category) : categoryMap.set(category.parent_id, [category]);
            }
        }
        return roots;
    }
}