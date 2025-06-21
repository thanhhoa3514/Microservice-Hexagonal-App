import { ICommandRepository, IQueryRepository, IRepository } from "../interface";
import { BaseError, Op, Sequelize } from "sequelize";
import { Pagination, PaginationSchema } from "../model/paging";
import { EntityStatus } from "../model/mode-status";

export abstract class BaseRepositorySequelize<Entity, Condition, UpdateDTO> implements IRepository<Entity, Condition, UpdateDTO> {
    constructor(
        readonly queryRepository: BaseQueryRepositorySequelize<Entity, Condition>,
        readonly commandRepository: BaseCommandRepositorySequelize<Entity, UpdateDTO>
    ) {
    }
    async getById(id: string): Promise<Entity> {
        return await this.queryRepository.getById(id);
    }
    async getAll(pagination: Pagination, condition: Condition): Promise<{ entities: Entity[]; pagination: Pagination; }> {
        return await this.queryRepository.getAll(pagination, condition);
    }
    async count(condition: Condition): Promise<number> {
        return await this.queryRepository.count(condition);
    }
    async findByCondition(condition: Condition): Promise<Entity | null> {
        return await this.queryRepository.findByCondition(condition);
    }
    async update(id: string, data: UpdateDTO): Promise<void> {
        await this.commandRepository.update(id, data);
    }
    async delete(id: string): Promise<void> {
        await this.commandRepository.delete(id);

    }
    async insert(data: Entity): Promise<void> {
        await this.commandRepository.insert(data);
    }
}
export abstract class BaseQueryRepositorySequelize<Entity, Condition> implements IQueryRepository<Entity, Condition> {
    constructor(protected readonly sequelize: Sequelize, protected readonly modelName: string) { }
    async getById(id: string): Promise<Entity> {
        const entity = await this.sequelize.models[this.modelName].findByPk(id);
        if (!entity) {
            throw new Error(`${this.modelName} not found`);
        }
        return entity.get({ plain: true }) as Entity;
    }
    async findByCondition(condition: Condition): Promise<Entity | null> {
        const entity = await this.sequelize.models[this.modelName].findOne({ where: condition as any });
        if (!entity) {
            return null;
        }
        return entity.get({ plain: true }) as Entity;
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
    async count(condition: Condition): Promise<number> {
        return await this.sequelize.models[this.modelName].count({ where: condition as any });
    }
}
export abstract class BaseCommandRepositorySequelize<Entity, UpdateDTO> implements ICommandRepository<Entity, UpdateDTO> {
    constructor(protected readonly sequelize: Sequelize, protected readonly modelName: string) { }
    async insert(data: Entity): Promise<void> {
        await this.sequelize.models[this.modelName].create(data as any);
    }
    async update(id: string, data: UpdateDTO): Promise<void> {
        await this.sequelize.models[this.modelName].update(data as any, { where: { id } });
    }
    async delete(id: string): Promise<void> {
        await this.sequelize.models[this.modelName].destroy({ where: { id } });
    }
}