import { Request, Response } from "express";
import { CategoryPersistence } from "./repository/category-repo";
import { CategoryStatus } from "../model/category-enum";


export const getCategoryAPI = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const category = await CategoryPersistence.findByPk(id);
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
    })
}
