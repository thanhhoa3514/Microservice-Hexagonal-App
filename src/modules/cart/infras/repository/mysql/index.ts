
import { DataTypes, Model, Sequelize } from "sequelize";

export class CartPersistence extends Model {
    declare id: string;

}

export const modelName: string = "carts";
export function init(sequelize: Sequelize) {
    CartPersistence.init(
        {
            id: {
                type: DataTypes.UUID,

                primaryKey: true,
            },
            userId: {
                type: DataTypes.UUID,
                allowNull: false,
            },
            productId: {
                type: DataTypes.UUID,
                allowNull: false,
            },
            attribute: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            quantity: {
                type: DataTypes.INTEGER,
                allowNull: true,
            },


        }, {
        sequelize,
        modelName,
        tableName: "carts",
        timestamps: true,
        underscored: true,
        updatedAt: "updated_at",
        createdAt: "created_at",
    }
    );

    return {
        CartPersistence,
    }
}
