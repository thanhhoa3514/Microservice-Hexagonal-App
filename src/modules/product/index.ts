import { Router } from "express";

import { Sequelize } from "sequelize";
import { init } from "./infras/repository/mysql/index";
import { ProductRepositorySequelize } from "./infras/repository/mysql/product-repos-sequelize";
import { ProductUseCase } from "./usecase/index";
import { ProductHttpService } from "./infras/transport/http-service";
import { modelName } from "./model/product-model";

const router = Router();

export const setUpProductAPIHex = async (sequelize: Sequelize) => {
    init(sequelize);

    // Create repository (needs query + command repos if following brand pattern)
    const productRepository = new ProductRepositorySequelize(sequelize, modelName);

    // Create use case
    const productUseCase = new ProductUseCase(productRepository);

    // Create HTTP service
    const productHttpService = new ProductHttpService(productUseCase);

    router.post("/products", productHttpService.create.bind(productHttpService));
    router.get("/products", productHttpService.findAll.bind(productHttpService));
    router.get("/products/:id", productHttpService.getById.bind(productHttpService));
    router.patch("/products/:id", productHttpService.update.bind(productHttpService));
    router.delete("/products/:id", productHttpService.delete.bind(productHttpService));

    return router;
}