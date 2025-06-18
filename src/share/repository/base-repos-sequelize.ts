import { IRepository } from "../interface";
import { BaseError, Op, Sequelize } from "sequelize";
import { Pagination, PaginationSchema } from "../model/paging";
import { EntityStatus } from "../model/mode-status";

export class BaseRepositorySequelize<Entity, Condition, UpdateDTO> implements IRepository<Entity, Condition, UpdateDTO> {
    constructor(protected readonly sequelize: Sequelize, protected readonly modelName: string) {
    }
    async getById(id: string): Promise<Entity> {
        const entity = await this.sequelize.models[this.modelName].findByPk(id);
        if (!entity) {
            throw new Error(`${this.modelName} not found`);
        }

        const persistenceData = entity.get({ plain: true });

        return {
            ...persistenceData,
            created_at: persistenceData.createdAt,
            updated_at: persistenceData.updatedAt
        } as Entity;
    }
    async getAll(pagination: Pagination, condition: Condition): Promise<{ entities: Entity[]; pagination: Pagination; }> {
        const { success, data, error } = PaginationSchema.safeParse(pagination);
        if (!success) {
            throw BaseError;
        }
        const conSQL = { ...condition, status: { [Op.ne]: EntityStatus.DELETED } }
        const { page, limit } = data;
        const offset = (Number(page) - 1) * Number(limit);
        const total: number = await this.sequelize.models[this.modelName].count({
            where: conSQL
        });
        const entities = await this.sequelize.models[this.modelName].findAll({
            where: conSQL,
            offset,
            limit,
            order: [['created_at', 'DESC']]
        });
        const entitiesData = entities.map((entity) => {
            const persistenceData = entity.get({ plain: true });
            return {
                ...persistenceData,
                created_at: persistenceData.createdAt,
                updated_at: persistenceData.updatedAt
            } as Entity;
        });
        return {
            entities: entitiesData,
            pagination: { page, limit, total }
        }
    }
    async update(id: string, data: UpdateDTO): Promise<void> {
        await this.sequelize.models[this.modelName].update(data as any, { where: { id } });
    }
    async delete(id: string): Promise<void> {
        const [affectedRows] = await this.sequelize.models[this.modelName].update(
            { status: EntityStatus.DELETED },
            { where: { id } }
        );

        if (affectedRows === 0) {
            throw BaseError;
        }
    }
    async insert(data: Entity): Promise<void> {
        await this.sequelize.models[this.modelName].create(data as any);
    }
}