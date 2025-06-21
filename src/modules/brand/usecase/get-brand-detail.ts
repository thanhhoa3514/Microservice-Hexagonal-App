import { GetDetailBrandQuery, IBrandRepository } from "../interface";
import { Brand } from "../model/brand-model";
import { IQueryHandler } from "../../../share/interface";
import { BrandNotFoundError } from "../model/brand-error";
import { IQueryRepository } from "../../../share/interface";
import { BrandConditionDTO } from "../model/brand.dto";
import { BrandStatus } from "../model/brand-enum";

export class GetBrandDetailQueryHandler implements IQueryHandler<GetDetailBrandQuery, Brand> {
    constructor(private readonly brandRepository: IQueryRepository<Brand, BrandConditionDTO>) {
    }

    async execute(query: GetDetailBrandQuery): Promise<Brand> {
        const brand = await this.brandRepository.getById(query.id);
        if (!brand) {
            throw new BrandNotFoundError(query.id);
        }
        if (brand.status === BrandStatus.DELETED) {
            throw new BrandNotFoundError(query.id);
        }
        return brand;
    }
}