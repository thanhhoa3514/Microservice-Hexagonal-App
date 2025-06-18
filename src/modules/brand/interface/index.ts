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
export interface IBrandRepository extends IBrandQueryRepository, IBrandCommandRepository {

}

export interface IBrandQueryRepository {
    getById(id: string): Promise<Brand>;
    getAll(pagination: Pagination, condition: BrandConditionDTO): Promise<{ categories: Brand[], pagination: Pagination }>;
}

export interface IBrandCommandRepository {
    update(id: string, data: BrandUpdateDTO): Promise<void>;
    delete(id: string): Promise<void>;
    insert(data: Brand): Promise<void>;
}