import { Sequelize } from "sequelize"
import { init } from "./infras/repository/mysql"
import { UserRepositoryMysql } from "./infras/repository/mysql/user.repo"
import { userModelName } from "./model/user.model"
import { UserUseCase } from "./usecase"
import { UserHttpService } from "./infras/transport/http-service"
import { Router } from "express"


export const SetUpUserHexModule = (sequelize: Sequelize) => {
    init(sequelize)
    const userRepository = new UserRepositoryMysql(sequelize, userModelName);
    const userUseCase = new UserUseCase(userRepository);
    const userHttpService = new UserHttpService(userUseCase);
    const route = Router();

    route.post('/users', userHttpService.insert.bind(userHttpService));
    route.get('/users/:id', userHttpService.getById.bind(userHttpService));
    route.patch('/users/:id', userHttpService.update.bind(userHttpService));
    route.delete('/users/:id', userHttpService.delete.bind(userHttpService));
    route.get('/users', userHttpService.findAll.bind(userHttpService));
    // route.get('user/condition',userHttpService.execute.bind(userHttpService));
    // route.post('user/login',userHttpService.login.bind(userHttpService));
    route.post('/users/auth/register', userHttpService.register.bind(userHttpService));
    route.post('/users/auth/login', userHttpService.login.bind(userHttpService));
    route.get('/users/auth/profile', userHttpService.profile.bind(userHttpService));
    // route.post('user/verify',userHttpService.verify.bind(userHttpService));
    return route;
}