import { BaseRepositorySequelize } from "../../../../../share/repository/base-repos-sequelize";
import { Sequelize } from "sequelize";
import { Brand, BrandSchema, modelName } from "../../../model/brand-model";
import { BrandConditionDTO, BrandUpdateDTO } from "../../../model/brand.dto";
import { Pagination } from "../../../../../share/model/paging";
import { BrandStatus } from "../../../model/brand-enum";
import { BrandPersistence } from "./index";
import { BaseError } from "../../../../../share/model/base-error";

export class BrandRepositorySequelize extends BaseRepositorySequelize<Brand, BrandConditionDTO, BrandUpdateDTO> {
    constructor(sequelize: Sequelize) {
        super(sequelize, modelName);

    }
    async getById(id: string): Promise<Brand> {
        const brand = await BrandPersistence.findByPk(id);
        if (!brand) {
            throw BaseError;
        }
        return BrandSchema.parse(brand.get({ plain: true }));
    }
    async getAll(pagination: Pagination, condition: BrandConditionDTO): Promise<{ entities: Brand[]; pagination: Pagination; }> {
        const { page, limit, total } = pagination;
        const offset = (Number(page) - 1) * Number(limit);
        const brands = await BrandPersistence.findAll({
            where: condition,
            limit: limit,
            offset: offset,
        });
        return {
            entities: brands.map((brand) => BrandSchema.parse(brand.get({ plain: true }))),
            pagination: { page, limit, total }
        }
    }
    async update(id: string, data: BrandUpdateDTO): Promise<void> {
        await this.sequelize.models[this.modelName].update(data, { where: { id } });
    }
    async delete(id: string): Promise<void> {
        await this.sequelize.models[this.modelName].update({ status: BrandStatus.DELETED }, { where: { id } });
    }
    async insert(data: Brand): Promise<void> {
        await this.sequelize.models[modelName].create(data);
    }
}