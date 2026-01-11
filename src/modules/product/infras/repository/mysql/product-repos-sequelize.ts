import { BaseCommandRepositorySequelize, BaseQueryRepositorySequelize, BaseRepositorySequelize } from "../../../../../share/repository/base-repos-sequelize";
import { Op, Sequelize } from "sequelize";
import { Product } from "../../../model/product-model";
import { ProductConditionDTO, ProductUpdateDTO } from "../../../model/product.dto";


export class ProductRepositorySequelize extends BaseRepositorySequelize<Product, ProductConditionDTO, ProductUpdateDTO> {
    constructor(sequelize: Sequelize, readonly modelName: string) {
        super(
            new ProductQueryRepositorySequelize(sequelize, modelName),
            new ProductCommandRepositorySequelize(sequelize, modelName)
        );
    }

}
export class ProductQueryRepositorySequelize extends BaseQueryRepositorySequelize<Product, ProductConditionDTO> {
    constructor(sequelize: Sequelize, readonly modelName: string) {
        super(sequelize, modelName);
    }
    // async getById(id: string): Promise<Product> {
    //     const entity = await this.sequelize.models[this.modelName].findByPk(id, {
    //         include: [
    //             { model: this.sequelize.models["ProductCategory"], as: "category" },
    //             { model: this.sequelize.models["ProductBrand"], as: "brand" }
    //         ]
    //     });
    //     if (!entity) {
    //         throw new Error(`${this.modelName} not found`);
    //     }
    //     return entity.get({ plain: true }) as Product;
    // }
    async getByIds(ids: string[]): Promise<Product[]> {
        const entities = await this.sequelize.models[this.modelName].findAll({
            where: { id: { [Op.in]: ids } }
            // Temporarily removed include until models are properly set up
            // include: [
            //     { model: this.sequelize.models["ProductCategory"], as: "category" },
            //     { model: this.sequelize.models["ProductBrand"], as: "brand" }
            // ]
        });
        return entities.map(entity => entity.get({ plain: true })) as Product[];
    }
}
export class ProductCommandRepositorySequelize extends BaseCommandRepositorySequelize<Product, ProductUpdateDTO> {
    constructor(sequelize: Sequelize, readonly modelName: string) {
        super(sequelize, modelName);
    }
}