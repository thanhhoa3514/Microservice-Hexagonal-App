import { Router } from "express";

import { Sequelize } from "sequelize";
import { init, modelName } from "./infras/repository/category-repo";
import { CategoryRepository } from "./infras/repository/repo";
import { CategoryUseCase } from "./usecase";
import { CategoryHttpService } from "./infras/transport/http-service";
import { ServiceContext } from "@share/interface/service-context";
import { UserRole } from "@share/model/mode-status";
const router = Router();

export const setUpCategoryAPIHex = async (sequelize: Sequelize, serviceContext: ServiceContext) => {
    init(sequelize);
    const categoryRepository = new CategoryRepository(sequelize, modelName);
    const categoryUseCase = new CategoryUseCase(categoryRepository);
    const categoryHttpService = new CategoryHttpService(categoryUseCase);

    router.post("/categories", serviceContext.mdlFactory.authMiddleware, serviceContext.mdlFactory.checkRole([UserRole.ADMIN]), categoryHttpService.createNewCategoryAPI.bind(categoryHttpService));
    router.get("/categories", categoryHttpService.listCategoryAPI.bind(categoryHttpService));
    router.get("/categories/:id", categoryHttpService.getDetailCategoryAPI.bind(categoryHttpService));
    router.patch("/categories/:id", serviceContext.mdlFactory.authMiddleware, serviceContext.mdlFactory.checkRole([UserRole.ADMIN]), categoryHttpService.updateCategoryAPI.bind(categoryHttpService));
    router.delete("/categories/:id", serviceContext.mdlFactory.authMiddleware, serviceContext.mdlFactory.checkRole([UserRole.ADMIN]), categoryHttpService.deleteCategoryAPI.bind(categoryHttpService));

    router.post("/categories/rpc/find-all", serviceContext.mdlFactory.authMiddleware,
        async (req, res) => {
            const { ids } = req.body;
            const data = await categoryUseCase.findAll(ids as string[]);
            res.status(200).json(data);
        }
    );
    return router;
}