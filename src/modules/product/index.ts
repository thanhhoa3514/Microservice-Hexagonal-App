import { Router } from "express";

import { Sequelize } from "sequelize";
import { init } from "./infras/repository/mysql/index";
import { ProductRepositorySequelize } from "./infras/repository/mysql/product-repos-sequelize";
import { ProductUseCase } from "./usecase/index";
import { ProductHttpService } from "./infras/transport/http-service";
import { modelName } from "./model/product-model";
import { RPCProductBrandRepository, RPCProductCategoryRepository } from "./infras/repository/rpc";
import { config } from "@share/component/config";

const router = Router();

export const setUpProductAPIHex = async (sequelize: Sequelize) => {
    init(sequelize);

    // Create repository (needs query + command repos if following brand pattern)
    const productRepository = new ProductRepositorySequelize(sequelize, modelName);

    // Create use case
    const productUseCase = new ProductUseCase(productRepository);

    const rpcProductBrandRepository = new RPCProductBrandRepository(config.rpc.product.baseURL!);
    const rpcProductCategoryRepository = new RPCProductCategoryRepository(config.rpc.category.baseURL!);
    // Create HTTP service
    const productHttpService = new ProductHttpService(productUseCase, rpcProductBrandRepository, rpcProductCategoryRepository);

    router.post("/products", productHttpService.insert.bind(productHttpService));
    router.get("/products", productHttpService.findAll.bind(productHttpService));
    router.get("/products/:id", productHttpService.getById.bind(productHttpService));
    router.patch("/products/:id", productHttpService.update.bind(productHttpService));
    router.delete("/products/:id", productHttpService.delete.bind(productHttpService));

    return router;
}