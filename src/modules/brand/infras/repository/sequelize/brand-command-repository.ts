import { BaseCommandRepositorySequelize } from "@share/repository/base-repos-sequelize";
import { Brand, modelName } from "@modules/brand/model/brand-model";
import { BrandUpdateDTO } from "@modules/brand/model/brand.dto";
import { BrandStatus } from "@modules/brand/model/brand-enum";
import { IBrandCommandRepository } from "@modules/brand/interface";
import { BrandPersistence } from "./index";
import { Sequelize } from "sequelize";

export class BrandCommandRepositorySequelize extends BaseCommandRepositorySequelize<Brand, BrandUpdateDTO> implements IBrandCommandRepository {
    constructor(sequelize: Sequelize) {
        super(sequelize, modelName);
    }

    // Override methods if needed for custom logic
    async insert(data: Brand): Promise<void> {
        await BrandPersistence.create(data);
    }

    async update(id: string, data: BrandUpdateDTO): Promise<void> {
        await BrandPersistence.update(data, { where: { id } });
    }

    async delete(id: string): Promise<void> {
        // Soft delete by updating status
        await BrandPersistence.update({ status: BrandStatus.DELETED }, { where: { id } });
    }
} 