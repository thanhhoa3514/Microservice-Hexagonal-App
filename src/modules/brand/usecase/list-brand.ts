import { IQueryHandler, IQueryRepository } from "../../../share/interface";
import { Pagination } from "../../../share/model/paging";
import { ListBrandQuery } from "../interface";
import { Brand } from "../model/brand-model";
import { BrandConditionDTO } from "../model/brand.dto";

export class ListBrandQueryHandler implements IQueryHandler<ListBrandQuery, { brands: Brand[], pagination: Pagination }> {
    constructor(private readonly brandRepository: IQueryRepository<Brand, BrandConditionDTO>) {
    }

    async execute(query: ListBrandQuery): Promise<{ brands: Brand[], pagination: Pagination }> {
        const { entities, pagination } = await this.brandRepository.getAll(query.pagination, query.condition);
        return { brands: entities as Brand[], pagination };
    }
}