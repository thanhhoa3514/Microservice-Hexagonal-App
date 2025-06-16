import { Request, Response } from "express";
import { CategoryCreateDTOSchema } from "../model/category-dto";

import { v7 } from "uuid";
import { CategoryPersistence } from "./repository/category-repo";
import { CategoryStatus } from "../model/category-enum";


export const createCategoryAPI = async (req: Request, res: Response): Promise<void> => {
    const { success, data, error } = CategoryCreateDTOSchema.safeParse(req.body);
    if (!success) {
        res.status(400).json({
            message: "Invalid request body",
            error: error.message
        });
        return;
    }
    const id = v7();
    await CategoryPersistence.create({
        id: id,
        name: data.name,
        image: data.image,
        description: data.description,
        parent_id: data.parent_id,
        status: CategoryStatus.ACTIVE
    });

    res.status(201).json({
        message: "Category created successfully",
        data: {
            id
        }
    });

}