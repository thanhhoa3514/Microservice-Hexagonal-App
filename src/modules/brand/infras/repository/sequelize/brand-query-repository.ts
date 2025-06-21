import { BaseQueryRepositorySequelize } from "@share/repository/base-repos-sequelize";
import { Brand, BrandSchema, modelName } from "@modules/brand/model/brand-model";
import { BrandConditionDTO } from "@modules/brand/model/brand.dto";
import { Pagination } from "@share/model/paging";
import { IBrandQueryRepository } from "@modules/brand/interface";
import { BrandPersistence } from "./index";
import { Sequelize } from "sequelize";

export class BrandQueryRepositorySequelize extends BaseQueryRepositorySequelize<Brand, BrandConditionDTO> implements IBrandQueryRepository {
    constructor(sequelize: Sequelize) {
        super(sequelize, modelName);
    }

    // Override methods if needed for custom logic
    async getById(id: string): Promise<Brand> {
        const brand = await BrandPersistence.findByPk(id);
        if (!brand) {
            throw new Error(`Brand with ID ${id} not found`);
        }
        return BrandSchema.parse(brand.get({ plain: true }));
    }

    async getAll(pagination: Pagination, condition: BrandConditionDTO): Promise<{ entities: Brand[]; pagination: Pagination; }> {
        // Use base implementation with custom logic if needed
        return super.getAll(pagination, condition);
    }
} 