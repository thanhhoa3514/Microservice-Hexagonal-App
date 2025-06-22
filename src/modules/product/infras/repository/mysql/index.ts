import { DataTypes, Model, Sequelize } from "sequelize";
import { ProductStatus } from "../../../model/product-enum";

export class ProductPersistence extends Model {
    declare id: string;
    declare status: ProductStatus;
}
export class CategoryPersistence extends Model { }
export class BrandPersistence extends Model { }
export const modelName: string = "products";
export function init(sequelize: Sequelize) {
    ProductPersistence.init(
        {
            id: {
                type: DataTypes.UUID,

                primaryKey: true,
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            images: {
                type: DataTypes.JSON,
                allowNull: true,
            },
            colors: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            quantity: {
                type: DataTypes.INTEGER,
                allowNull: true,
            },
            price: {
                type: DataTypes.DECIMAL(10, 2),
                allowNull: false,
            },
            salePrice: {
                type: DataTypes.DECIMAL(10, 2),
                allowNull: true,
                field: "sale_price",
            },
            description: {
                type: DataTypes.TEXT,
                allowNull: true,
            },
            content: {
                type: DataTypes.TEXT,
                allowNull: true,
            },
            rating: {
                type: DataTypes.FLOAT,
                allowNull: true,
            },
            saleCount: {
                type: DataTypes.INTEGER,
                allowNull: true,
                field: "sale_count",
            },
            brandId: {
                type: DataTypes.UUID,
                allowNull: true,
                field: "brand_id",
            },
            categoryId: {
                type: DataTypes.UUID,
                allowNull: false,
                field: "category_id",
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
        tableName: "products",
        timestamps: true,
        underscored: true,
        updatedAt: "updated_at",
        createdAt: "created_at",
    }
    );
    // CategoryPersistence.init(
    //     {
    //         id: {
    //             type: DataTypes.UUID,
    //             primaryKey: true,
    //         },
    //         name: {
    //             type: DataTypes.STRING,
    //             allowNull: false,
    //         },
    //     },
    //     {
    //         sequelize,
    //         modelName: "ProductCategory",
    //         tableName: "categories",
    //         createdAt: false,
    //         updatedAt: false,
    //     }
    // );
    // BrandPersistence.init(
    //     {
    //         id: {
    //             type: DataTypes.UUID,
    //             primaryKey: true,
    //         },
    //         name: {
    //             type: DataTypes.STRING,
    //             allowNull: false,
    //         },
    //     },
    //     {
    //         sequelize,
    //         modelName: "ProductBrand",
    //         tableName: "brands",
    //         createdAt: false,
    //         updatedAt: false,
    //     }
    // );

    // ProductPersistence.belongsTo(CategoryPersistence, { foreignKey: { field: "category_id" }, as: "category" });
    // ProductPersistence.belongsTo(BrandPersistence, { foreignKey: { field: "brand_id" }, as: "brand" });

    // CategoryPersistence.hasMany(ProductPersistence, { foreignKey: { field: "category_id"}, as: "products" });
    // BrandPersistence.hasMany(ProductPersistence, { foreignKey: { field: "brand_id"}, as: "products" });

    return {
        ProductPersistence,
    }
}