import { DataTypes, Model, Sequelize } from "sequelize";
import { CategoryStatus } from "../../model/category-enum";
export class CategoryPersistence extends Model {
    declare id: string;
    declare status: CategoryStatus;
}
export const modelName: string = "Category";
export function init(sequelize: Sequelize) {
    CategoryPersistence.init(
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
            parentId: {
                type: DataTypes.STRING,
                field: "parent_id",
                allowNull: true,
            },
            status: {
                type: DataTypes.ENUM("active", "inactive"),
                allowNull: false,
                defaultValue: "active",
                validate: {
                    isIn: [["active", "inactive"]],
                },
            },

        }, {
        sequelize,
        modelName,
        tableName: "categories",
        timestamps: true,
        underscored: true,
        updatedAt: "updated_at",
        createdAt: "created_at",
    });
    return CategoryPersistence;
}