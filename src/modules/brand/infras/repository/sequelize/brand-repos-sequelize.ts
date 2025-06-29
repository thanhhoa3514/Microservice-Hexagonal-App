import { BaseRepositorySequelize } from "@share/repository/base-repos-sequelize";

import { Brand, BrandSchema } from "@modules/brand/model/brand-model";
import { BrandConditionDTO, BrandUpdateDTO } from "@modules/brand/model/brand.dto";
import { Pagination } from "@share/model/paging";
import { BrandStatus } from "@modules/brand/model/brand-enum";
import { BrandPersistence } from "@modules/brand/infras/repository/sequelize/index";
import { BaseError } from "@share/model/base-error";
import { IBrandQueryRepository, IBrandCommandRepository } from "@modules/brand/interface";
import { Op } from "sequelize";

export class BrandRepositorySequelize extends BaseRepositorySequelize<Brand, BrandConditionDTO, BrandUpdateDTO> {
    constructor(
        readonly commandRepository: IBrandCommandRepository,
        readonly queryRepository: IBrandQueryRepository
    ) {
        super(queryRepository, commandRepository);

    }
    async getById(id: string): Promise<Brand> {
        const brand = await BrandPersistence.findByPk(id);

        if (!brand) {
            throw BaseError;
        }
        return BrandSchema.parse(brand.get({ plain: true }));
    }
    async getAll(pagination: Pagination, condition: BrandConditionDTO): Promise<{ entities: Brand[]; pagination: Pagination; }> {

        // Calculate offset for pagination
        const offset = (Number(pagination.page) - 1) * Number(pagination.limit);

        // Build where clause - default to ACTIVE status if no condition provided
        const whereClause = {
            status: BrandStatus.ACTIVE,

        };

        // Count total records with conditions
        const total: number = await BrandPersistence.count({
            where: whereClause
        });

        // Fetch brands with pagination and conditions
        const brands = await BrandPersistence.findAll({
            where: whereClause,
            order: [['created_at', 'DESC']], // Most recent first
            offset,
            limit: pagination.limit
        });

        // Parse data with schema validation
        const brandList = brands.map(brand => {
            return BrandSchema.parse(brand.get({ plain: true }));
        });

        return {
            entities: brandList,
            pagination: {
                page: pagination.page,
                limit: pagination.limit,
                total
            }
        }
    }
    async update(id: string, data: BrandUpdateDTO): Promise<void> {
        await BrandPersistence.update(data, { where: { id } });
    }
    async delete(id: string): Promise<void> {
        await BrandPersistence.update({ status: BrandStatus.DELETED }, { where: { id } });
    }
    async insert(data: Brand): Promise<void> {
        await BrandPersistence.create(data);
    }
    async findByCondition(condition: BrandConditionDTO): Promise<Brand | null> {
        const brand = await BrandPersistence.findOne({ where: { name: condition.name } });
        if (!brand) {
            return null;
        }
        return BrandSchema.parse(brand.get({ plain: true }));
    }
    async findAll(ids: string[]): Promise<Brand[]> {
        const brands = await BrandPersistence.findAll({ where: { id: { [Op.in]: ids } } });
        return brands.map(brand => BrandSchema.parse(brand.get({ plain: true })));
    }
}