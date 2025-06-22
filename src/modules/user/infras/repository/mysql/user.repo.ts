
import { UserDTO, UserConditionDTO, UserUpdateDTO } from "@modules/user/model/user.model";
import { Sequelize } from "sequelize";
import { BaseCommandRepositorySequelize, BaseQueryRepositorySequelize, BaseRepositorySequelize } from "@share/repository/base-repos-sequelize";

export class UserRepositoryMysql extends BaseRepositorySequelize<UserDTO, UserConditionDTO, UserUpdateDTO> {
    constructor(sequelize: Sequelize, readonly modelName: string) {
        super(
            new UserQueryRepositorySequelize(sequelize, modelName),
            new UserCommandRepositorySequelize(sequelize, modelName)
        );
    }


}


export class UserQueryRepositorySequelize extends BaseQueryRepositorySequelize<UserDTO, UserConditionDTO> {
    constructor(sequelize: Sequelize, readonly modelName: string) {
        super(sequelize, modelName);
    }


}
export class UserCommandRepositorySequelize extends BaseCommandRepositorySequelize<UserDTO, UserUpdateDTO> {
    constructor(sequelize: Sequelize, readonly modelName: string) {
        super(sequelize, modelName);
    }
}