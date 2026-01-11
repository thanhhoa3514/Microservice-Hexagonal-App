
import { Sequelize } from "sequelize";
import { ServiceContext } from "@share/interface/service-context";
import { init } from "./infras/repository/mysql";

import { Router } from "express";

import { CartRepositorySequelize } from "./infras/repository/mysql/repository";
import { cartModelName } from "./interface";
import { CartUseCase } from "./usecase";

import { RPCCartProductRepository } from "./infras/repository/rpc";
import { config } from "@share/component/config";
import { CartHttpService } from "./infras/transport/http-service";
const router = Router();
export const setUpCartAPIHex = async (sequelize: Sequelize, serviceContext: ServiceContext) => {
    init(sequelize);

    // // Create repository (needs query + command repos if following brand pattern)


    const cartRepository = new CartRepositorySequelize(sequelize, cartModelName);
    const ProductRPCRepository = new RPCCartProductRepository(config.rpc.product.baseURL!);

    // Create use case with properly typed repositories
    const cartUseCase = new CartUseCase(
        cartRepository, // ICartCommandRepository
        cartRepository, // ICartQueryRepository
        ProductRPCRepository // IProductQueryRepository
    );
    // Create HTTP service
    const cartHttpService = new CartHttpService(cartUseCase);

    router.post("/carts", serviceContext.mdlFactory.authMiddleware, cartHttpService.addProductToCartAPI.bind(cartHttpService));
    router.get("/carts", serviceContext.mdlFactory.authMiddleware, cartHttpService.getCartAPI.bind(cartHttpService));
    router.patch("/carts", serviceContext.mdlFactory.authMiddleware, cartHttpService.updateProductInCartAPI.bind(cartHttpService));
    router.delete("/carts", serviceContext.mdlFactory.authMiddleware, cartHttpService.deleteProductFromCartAPI.bind(cartHttpService));
    router.delete("/carts/:id", serviceContext.mdlFactory.authMiddleware, cartHttpService.deleteProductAPI.bind(cartHttpService));


    // GRPC
    router.post("/grpc/carts/items", cartHttpService.listItemsGrpcAPI.bind(cartHttpService));
    router.delete("/grpc/carts/items/:id", cartHttpService.deleteProductGrpcAPI.bind(cartHttpService));
    return router;
}