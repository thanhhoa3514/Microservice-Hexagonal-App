import { Request, Response } from "express";
import { CategoryCreateDTO, CategoryCreateDTOSchema, CategoryUpdateDTO, CategoryUpdateDTOSchema } from "../../model/category-dto";

import { ICategoryUseCase } from "../../interface";
import { PaginationSchema } from "../../../../share/model/paging";
import { CategoryStatus } from "../../model/category-enum";

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
        res.status(200).json({
            message: "Categories listed successfully",
            data: {
                categories,
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
}