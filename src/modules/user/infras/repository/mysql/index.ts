
import { DataTypes, Model, Sequelize } from "sequelize";


export class UserPersistence extends Model {
    declare id: string;

}

export const modelName: string = "users";
export function init(sequelize: Sequelize) {
    UserPersistence.init(
        {
            id: {
                type: DataTypes.UUID,

                primaryKey: true,
            },
            firstName: {
                type: DataTypes.STRING,
                allowNull: false,
                field: "first_name",
            },
            lastName: {
                type: DataTypes.STRING,
                allowNull: false,
                field: "last_name",
            },
            avatar: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            email: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            password: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            salt: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            phone: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            address: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            birthday: {
                type: DataTypes.DATE,
                allowNull: true,
            },
            gender: {
                type: DataTypes.ENUM("male", "female", "unknown"),
                allowNull: true,
                defaultValue: "unknown",
                validate: {
                    isIn: [["male", "female", "unknown"]],
                },
            },
            role: {
                type: DataTypes.ENUM("admin", "user"),
                allowNull: false,
                defaultValue: "user",
                validate: {
                    isIn: [["admin", "user"]],
                },
            },
            status: {
                type: DataTypes.ENUM("active", "inactive", "deleted", "banned", "sold"),
                allowNull: false,
                defaultValue: "active",
                validate: {
                    isIn: [["active", "inactive", "deleted", "banned", "sold"]],
                },
            },

        }, {
        sequelize,
        modelName,
        tableName: "users",
        timestamps: true,
        underscored: true,
        updatedAt: "updated_at",
        createdAt: "created_at",
    }
    );

}