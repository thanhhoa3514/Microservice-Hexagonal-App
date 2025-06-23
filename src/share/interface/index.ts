
import { Pagination } from "../model/paging";
import { UserRole } from "../model/mode-status";

export interface IRepository<Entity, Condition, UpdateDTO> extends IQueryRepository<Entity, Condition>, ICommandRepository<Entity, UpdateDTO> {

}
export interface IQueryRepository<Entity, Condition> {
    getById(id: string): Promise<Entity>;
    getAll(pagination: Pagination, condition: Condition): Promise<{ entities: Entity[], pagination: Pagination }>;
}

export interface ICommandRepository<Entity, UpdateDTO> {
    update(id: string, data: UpdateDTO): Promise<void>;
    delete(id: string): Promise<void>;
    insert(data: Entity): Promise<void>;
}
export interface ICreateNewBrandCommandHandler<Command, Result> {
    execute(data: Command): Promise<Result>;
}
export interface IQueryHandler<Query, Result> {
    execute(query: Query): Promise<Result>;
}
export interface ICommandHandler<Command, Result> {
    execute(data: Command): Promise<Result>;
}
export interface IUseCase<CreateDTO, UpdateDTO, Entity, Condition> {
    insert(data: CreateDTO): Promise<string>;
    execute(query: { pagination: Pagination, condition: Condition }): Promise<{ entities: Entity[], pagination: Pagination }>;
    getById(id: string): Promise<Entity>;
    update(id: string, data: UpdateDTO): Promise<void>;
    delete(id: string): Promise<void>;
}

export interface TokenPayLoad {
    sub: string;
    role: UserRole
}
export interface Requester extends TokenPayLoad {

}
export interface ITokenProvider {
    generateToken(payload: TokenPayLoad): Promise<string>;
    verifyToken(token: string): Promise<TokenPayLoad | null>;
}
export type UserToken = {
    accessToken: string;
    refreshToken: string;
}


export type TokenIntrospectResult = {
    payload: TokenPayLoad;
    error?: string;
    isOk: boolean;
}

export type ITokenIntrospect = {
    introspect(token: string): Promise<TokenIntrospectResult>;
}


