import { Router } from "express";

import { Sequelize } from "sequelize";
import { init } from "./infras/repository/sequelize/index";
import { BrandRepositorySequelize } from "./infras/repository/sequelize/brand-repos-sequelize";
import { BrandUseCase } from "./usecase";
import { BrandHttpService } from "./infras/transport/http-service";

const router = Router();

export const setUpBrandAPIHex = async (sequelize: Sequelize) => {
    init(sequelize);
    const brandRepository = new BrandRepositorySequelize(sequelize);
    const brandUseCase = new BrandUseCase(brandRepository);
    const brandHttpService = new BrandHttpService(brandUseCase);


    router.post("/brands", brandHttpService.createAPI.bind(brandHttpService));
    router.get("/brands", brandHttpService.listAPI.bind(brandHttpService));
    router.get("/brands/:id", brandHttpService.getDetailAPI.bind(brandHttpService));
    router.patch("/brands/:id", brandHttpService.updateAPI.bind(brandHttpService));
    router.delete("/brands/:id", brandHttpService.deleteAPI.bind(brandHttpService));

    return router;
}