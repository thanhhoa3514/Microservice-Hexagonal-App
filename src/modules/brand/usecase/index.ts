import { IRepository } from "../../../share/interface";
import { Pagination } from "../../../share/model/paging";
import { IBrandUseCase } from "../interface";
import { BrandStatus } from "../model/brand-enum";
import { Brand, BrandSchema } from "../model/brand-model";
import { BrandConditionDTO, BrandCreateDTO, BrandUpdateDTO } from "../model/brand.dto";
import { v7 } from "uuid";

export class BrandUseCase implements IBrandUseCase {
    constructor(private readonly brandRepository: IRepository<Brand, BrandConditionDTO, BrandUpdateDTO>) {
    }
    async createNewBrand(data: BrandCreateDTO): Promise<string> {
        const id = v7();
        const { success, data: brand, error } = BrandSchema.safeParse(data);
        if (!success) {
            throw new Error(error.message);
        }
        const brandData: Brand = {
            id: id,
            name: brand.name,
            image: brand.image,
            description: brand.description,
            tagLine: brand.tagLine,
            status: BrandStatus.ACTIVE,
            created_at: new Date(),
            updated_at: new Date()
        }

        await this.brandRepository.insert(brandData);
        return id;
    }
    async updateBrand(id: string, data: BrandUpdateDTO): Promise<void> {
        return this.brandRepository.update(id, data);
    }
    async deleteBrand(id: string): Promise<void> {
        return this.brandRepository.delete(id);
    }
    async getDetailBrand(id: string): Promise<Brand> {
        return this.brandRepository.getById(id);
    }
    // async listBrand(pagination: Pagination, condition: BrandConditionDTO): Promise<{ brands: Brand[], pagination: Pagination }> {
    //       await this.brandRepository.getAll(pagination, condition);
    // }
}