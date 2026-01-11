import "module-alias/register";
import { config } from "dotenv";
import { setUpCategoryAPIHex } from "@modules/category";
import { setUpBrandAPIHex } from "@modules/brand";
import { setUpProductAPIHex } from "@modules/product";
import { SetUpUserHexModule } from "@modules/user";
import { TokenIntrospectRpcClient } from "@share/repository/verify-token-rpc-client";
import { authMiddleware } from "@share/middleware/auth";
import { NextFunction, Request, Response } from "express";
import morgan from "morgan";
config();
const express = require("express");
import { sequelize } from "@share/component/sequelize";
import { setUpMiddleware } from "@share/middleware";
import { checkRole } from "./share/middleware/checkrole";
import { UserRole } from "./share/model/mode-status";

import { setUpCartAPIHex } from "@modules/cart";
import { setupOrderModuleHex } from "@modules/order";
(async () => {
    await sequelize.authenticate();
    console.log("Database connected");
    const app = express();
    const port = process.env.PORT || 3000;
    const tokenIntrospectRpcClient = new TokenIntrospectRpcClient(process.env.TOKEN_INTROSPECT_RPC_URL as string);
    const authMiddleware1 = authMiddleware(tokenIntrospectRpcClient);
    app.use(morgan("dev"));
    app.get('/v1/protected', authMiddleware1, checkRole([UserRole.ADMIN]), (req: Request, res: Response) => {
        res.status(200).json({
            message: "Protected route",
            data: res.locals['requester']
        });
    });
    const serviceContext = { mdlFactory: setUpMiddleware(tokenIntrospectRpcClient) };
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use('/v1', await setUpCategoryAPIHex(sequelize, serviceContext));
    app.use('/v1', await setUpBrandAPIHex(sequelize, serviceContext));
    app.use('/v1', await setUpProductAPIHex(sequelize, serviceContext));
    app.use('/v1', await SetUpUserHexModule(sequelize, serviceContext));
    app.use('/v1', await setUpCartAPIHex(sequelize, serviceContext));
    app.use('/v1', await setupOrderModuleHex(sequelize, serviceContext));

    // error handling middleware v5
    // app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    //     responseError(res, err);
    //     next();
    // });

    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
})();
