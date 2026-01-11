import { ServiceContext } from "@share/interface/service-context";
import { Sequelize } from "sequelize";
import { init, OrderCommandRepository, OrderQueryRepository } from "./infras/repository/mysql";
import { OrderUseCase } from "./usecase";
import { OrderGRPCCartQueryRepository, OrderGRPCProductQueryRepository } from "./infras/repository/grpc";
import { config } from "@/share/component/config";
import { OrderHttpService } from "./infras/transport/http-service";
import { Router } from "express";



export const setupOrderModuleHex = (sequelize: Sequelize, serviceContext: ServiceContext) => {
    init(sequelize);
    const orderQueryRepository = new OrderQueryRepository(sequelize);
    const orderCommandRepository = new OrderCommandRepository(sequelize);
    const cartQueryRepository = new OrderGRPCCartQueryRepository(config.rpc.cart.baseURL as string);
    const productQueryRepository = new OrderGRPCProductQueryRepository(config.rpc.product.baseURL as string);
    const orderUseCase = new OrderUseCase(orderQueryRepository, orderCommandRepository, cartQueryRepository, productQueryRepository);
    const orderHttpService = new OrderHttpService(orderUseCase);
    const router = Router();
    router.post("/orders", serviceContext.mdlFactory.authMiddleware, orderHttpService.makeOrderAPI);
    // router.put("/:id", serviceContext.mdlFactory.authMiddleware, orderHttpService.updateOrderAPI);
    // router.delete("/:id", serviceContext.mdlFactory.authMiddleware, orderHttpService.deleteOrderAPI);
    // router.get("/", serviceContext.mdlFactory.authMiddleware, orderHttpService.listOrdersAPI);
    // router.get("/:id", serviceContext.mdlFactory.authMiddleware, orderHttpService.getOrderAPI);
    return router;
}