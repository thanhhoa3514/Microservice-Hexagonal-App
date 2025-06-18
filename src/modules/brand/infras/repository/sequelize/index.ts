import { DataTypes, Model, Sequelize } from "sequelize";
import { BrandStatus } from "../../../model/brand-enum";

export class BrandPersistence extends Model {
    declare id: string;
    declare status: BrandStatus;
}
export const modelName: string = "Brand";
export function init(sequelize: Sequelize) {
    BrandPersistence.init(
        {
            id: {
                type: DataTypes.STRING,
                primaryKey: true,
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            image: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            description: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            tagLine: {
                type: DataTypes.STRING,
                field: "tag_line",
                allowNull: true,
            },
            status: {
                type: DataTypes.ENUM("active", "inactive", "deleted"),
                allowNull: false,
                defaultValue: "active",
                validate: {
                    isIn: [["active", "inactive", "deleted"]],
                },
            },

        }, {
        sequelize,
        modelName,
        tableName: "brands",
        timestamps: true,
        underscored: true,
        updatedAt: "updated_at",
        createdAt: "created_at",
    });
    return BrandPersistence;
}