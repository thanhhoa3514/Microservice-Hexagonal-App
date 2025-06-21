import { ICommandRepository, IQueryRepository, IRepository } from "@share/interface";
import { BaseQueryRepositorySequelize, BaseCommandRepositorySequelize } from "@share/repository/base-repos-sequelize";
import { Pagination } from "@share/model/paging";
import { Brand } from "@modules/brand/model/brand-model";
import { BrandConditionDTO, BrandCreateDTO, BrandUpdateDTO } from "@modules/brand/model/brand.dto";



export interface IBrandUseCase {
    createNewBrand(data: BrandCreateDTO): Promise<string>;
    updateBrand(id: string, data: BrandUpdateDTO): Promise<void>;
    deleteBrand(id: string): Promise<void>;
    getDetailBrand(id: string): Promise<Brand>;
    listBrand(pagination: Pagination, condition: BrandConditionDTO): Promise<{ brands: Brand[], pagination: Pagination }>;
}

export interface CreateCommand {
    cmd: BrandCreateDTO;
}

export interface GetDetailBrandQuery {
    id: string;
}
export interface UpdateCommand {
    id: string;
    cmd: BrandUpdateDTO;
}
export interface DeleteCommand {
    id: string;
    isSoftDelete?: boolean;
}
export interface ListBrandQuery {
    pagination: Pagination;
    condition: BrandConditionDTO;
}

export interface IBrandRepository extends IRepository<Brand, BrandConditionDTO, BrandUpdateDTO> {
    findByCondition(condition: BrandConditionDTO): Promise<Brand | null>;
}
export interface IBrandQueryRepository extends BaseQueryRepositorySequelize<Brand, BrandConditionDTO> {
    // Inherits all base methods: getById, getAll, findByCondition, count
    // Plus sequelize, modelName properties
}
export interface IBrandCommandRepository extends BaseCommandRepositorySequelize<Brand, BrandUpdateDTO> {
    // Inherits all base methods: insert, update, delete
    // Plus sequelize, modelName properties
}
