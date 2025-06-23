import { Sequelize } from "sequelize"
import { init } from "./infras/repository/mysql"
import { UserRepositoryMysql } from "./infras/repository/mysql/user.repo"
import { userModelName } from "./model/user.model"
import { UserUseCase } from "./usecase"
import { UserHttpService } from "./infras/transport/http-service"
import { Router } from "express"
import { ServiceContext } from "@share/interface/service-context";
import { UserRole } from "@share/model/mode-status"


export const SetUpUserHexModule = (sequelize: Sequelize, serviceContext: ServiceContext) => {
    init(sequelize)
    const userRepository = new UserRepositoryMysql(sequelize, userModelName);
    const userUseCase = new UserUseCase(userRepository);
    const userHttpService = new UserHttpService(userUseCase);
    const route = Router();

    route.post('/users', serviceContext.mdlFactory.authMiddleware, serviceContext.mdlFactory.checkRole([UserRole.ADMIN]), userHttpService.insert.bind(userHttpService));
    route.get('/users/:id', serviceContext.mdlFactory.authMiddleware, userHttpService.getById.bind(userHttpService));
    route.patch('/users/:id', serviceContext.mdlFactory.authMiddleware, serviceContext.mdlFactory.checkRole([UserRole.ADMIN]), userHttpService.update.bind(userHttpService));
    route.delete('/users/:id', serviceContext.mdlFactory.authMiddleware, serviceContext.mdlFactory.checkRole([UserRole.ADMIN]), userHttpService.delete.bind(userHttpService));
    route.get('/users', userHttpService.findAll.bind(userHttpService));
    // route.get('user/condition',userHttpService.execute.bind(userHttpService));
    // route.post('user/login',userHttpService.login.bind(userHttpService));
    route.post('/users/auth/register', userHttpService.register.bind(userHttpService));
    route.post('/users/auth/login', userHttpService.login.bind(userHttpService));
    route.get('/users/auth/profile', userHttpService.profile.bind(userHttpService));
    route.patch('/users/auth/profile', serviceContext.mdlFactory.authMiddleware, userHttpService.updateProfile.bind(userHttpService));
    // route.post('user/verify',userHttpService.verify.bind(userHttpService));

    // RPC API(use for other microservices)
    route.post('/users/auth/introspect', userHttpService.introspect.bind(userHttpService));
    // route.post('/users/auth/refresh-token', userHttpService.refreshToken.bind(userHttpService));
    return route;
}