import { Request, Response } from "express";
import { CategoryUpdateDTOSchema } from "../model/category-dto";
import { CategoryPersistence } from "./repository/category-repo";
import { CategoryStatus } from "../model/category-enum";

export const updateCategoryAPI = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const { success, data, error } = CategoryUpdateDTOSchema.safeParse(req.body);
    if (!success) {
        res.status(400).json({
            message: "Invalid request body",
            error: error.message
        });
        return;
    }
    const category = await CategoryPersistence.findByPk(id);
    if (!category) {
        res.status(404).json({
            message: "Category not found",
        });
        return;
    }

    if (category.status === CategoryStatus.INACTIVE) {
        res.status(400).json({
            message: "Category is inactive",
        });
        return;
    }
    await CategoryPersistence.update(data, { where: { id } });
    res.status(200).json({
        message: "Category updated successfully",
    })
}