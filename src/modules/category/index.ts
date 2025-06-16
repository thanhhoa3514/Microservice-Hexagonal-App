import { Router } from "express";
import { createCategoryAPI } from "./infras/create-api";
import { getCategoryAPI } from "./infras/get-apit";
import { listCategoryAPI } from "./infras/list-api";
import { updateCategoryAPI } from "./infras/update-api";
import { deleteCategoryAPI } from "./infras/delete-api";
import { Sequelize } from "sequelize";
import { init } from "./infras/repository/category-repo";
const router = Router();

export const setUpCategoryAPIModule = async (sequelize: Sequelize) => {
    init(sequelize);
    router.post("/categories", createCategoryAPI);
    router.get("/categories", listCategoryAPI);
    router.get("/categories/:id", getCategoryAPI);
    router.patch("/categories/:id", updateCategoryAPI);
    router.delete("/categories/:id", deleteCategoryAPI);
    return router;
}