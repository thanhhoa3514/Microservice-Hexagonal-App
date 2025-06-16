import { Request, Response } from "express";
import { CategoryPersistence } from "./repository/category-repo";
import { CategoryStatus } from "../model/category-enum";
import { z } from "zod";

const PaginationSchema = z.object({
    page: z.coerce.number().int().positive().min(1).default(1),
    limit: z.coerce.number().int().positive().min(1).max(100).default(10)
})



export const listCategoryAPI = async (req: Request, res: Response): Promise<void> => {
    const { success, data, error } = PaginationSchema.safeParse(req.query);
    if (!success) {
        res.status(400).json({
            message: "Invalid request body",
            error: error.message
        });
        return;
    }
    const pagination = data;
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
    res.status(200).json({
        message: "Categories listed successfully",
        data: {
            categories,
            pagination: {
                total,
                page: pagination.page,
                limit: pagination.limit
            }
        }
    });
}

export default listCategoryAPI;