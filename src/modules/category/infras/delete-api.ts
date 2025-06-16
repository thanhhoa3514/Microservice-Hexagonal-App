import { Request, Response } from "express";
import { CategoryPersistence } from "./repository/category-repo";
import { CategoryStatus } from "../model/category-enum";
export const deleteCategoryAPI = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
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
    await CategoryPersistence.update({ status: CategoryStatus.DELETED }, { where: { id } });
    res.status(200).json({
        message: "Category deleted successfully",
    })
}