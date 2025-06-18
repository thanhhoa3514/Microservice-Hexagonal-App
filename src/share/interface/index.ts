import { Pagination } from "../model/paging";

export interface IRepository<Entity, Condition, UpdateDTO> extends IQueryRepository<Entity, Condition>, ICommandRepository<Entity, UpdateDTO> {

}
export interface IQueryRepository<Entity, Condition> {
    getById(id: string): Promise<Entity>;
    getAll(pagination: Pagination, condition: Condition): Promise<{ categories: Entity[], pagination: Pagination }>;
}

export interface ICommandRepository<Entity, UpdateDTO> {
    update(id: string, data: UpdateDTO): Promise<void>;
    delete(id: string): Promise<void>;
    insert(data: Entity): Promise<void>;
}