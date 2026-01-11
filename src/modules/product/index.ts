import { Router } from "express";

import { Sequelize } from "sequelize";
import { init } from "./infras/repository/mysql/index";
import { ProductRepositorySequelize } from "./infras/repository/mysql/product-repos-sequelize";
import { ProductUseCase } from "./usecase/index";
import { ProductHttpService } from "./infras/transport/http-service";
import { modelName } from "./model/product-model";
import { ProxyProductBrandRepository, RPCProductBrandRepository, RPCProductCategoryRepository } from "./infras/repository/rpc";
import { config } from "@share/component/config";
import { ServiceContext } from "@share/interface/service-context";
import { UserRole } from "@share/model/mode-status";

const router = Router();

export const setUpProductAPIHex = async (sequelize: Sequelize, serviceContext: ServiceContext) => {
    init(sequelize);

    // Create repository (needs query + command repos if following brand pattern)
    const productRepository = new ProductRepositorySequelize(sequelize, modelName);

    // Create use case

    const rpcProductBrandRepository = new ProxyProductBrandRepository(new RPCProductBrandRepository(config.rpc.product.baseURL!));
    const rpcProductCategoryRepository = new RPCProductCategoryRepository(config.rpc.category.baseURL!);
    const productUseCase = new ProductUseCase(productRepository, rpcProductBrandRepository, rpcProductCategoryRepository, productRepository.queryRepository);
    // Create HTTP service
    const productHttpService = new ProductHttpService(productUseCase, rpcProductBrandRepository, rpcProductCategoryRepository);

    router.post("/products", serviceContext.mdlFactory.authMiddleware, serviceContext.mdlFactory.checkRole([UserRole.ADMIN]), productHttpService.insert.bind(productHttpService));
    router.get("/products", serviceContext.mdlFactory.authMiddleware, productHttpService.findAll.bind(productHttpService));
    router.get("/products/:id", serviceContext.mdlFactory.authMiddleware, productHttpService.getById.bind(productHttpService));
    router.patch("/products/:id", serviceContext.mdlFactory.authMiddleware, serviceContext.mdlFactory.checkRole([UserRole.ADMIN]), productHttpService.update.bind(productHttpService));
    router.delete("/products/:id", serviceContext.mdlFactory.authMiddleware, serviceContext.mdlFactory.checkRole([UserRole.ADMIN]), productHttpService.delete.bind(productHttpService));

    // rpc
    router.post("/products/ids", serviceContext.mdlFactory.authMiddleware, productHttpService.getByIds.bind(productHttpService));
    return router;
}