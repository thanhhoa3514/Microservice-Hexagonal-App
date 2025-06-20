import { IRepository } from "../../../share/interface";
import { Pagination } from "../../../share/model/paging";
import { Brand } from "../model/brand-model";
import { BrandConditionDTO, BrandCreateDTO, BrandUpdateDTO } from "../model/brand.dto";



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
export interface ICreateNewBrandCommandHandler<Command, Result> {
    execute(data: CreateCommand): Promise<Result>;
}
export interface IBrandRepository extends IRepository<Brand, BrandConditionDTO, BrandUpdateDTO> {
    findByCondition(condition: BrandConditionDTO): Promise<Brand | null>;
}

