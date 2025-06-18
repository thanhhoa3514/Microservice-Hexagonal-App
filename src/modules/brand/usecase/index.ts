import { Pagination } from "../../../share/model/paging";
import { IBrandUseCase, IBrandRepository } from "../interface";
import { BrandStatus } from "../model/brand-enum";
import { Brand } from "../model/brand-model";
import { BrandConditionDTO, BrandCreateDTO, BrandUpdateDTO, BrandCreateDTOSchema } from "../model/brand.dto";
import { BrandNotFoundError, BrandAlreadyDeletedError, BrandValidationError } from "../model/brand-error";
import { v7 } from "uuid";

export class BrandUseCase implements IBrandUseCase {
    constructor(private readonly brandRepository: IBrandRepository) {
    }

    async createNewBrand(data: BrandCreateDTO): Promise<string> {
        // Validate input data
        const validation = BrandCreateDTOSchema.safeParse(data);
        if (!validation.success) {
            throw new BrandValidationError("createData", data, validation.error.message);
        }

        const id = v7();
        const brandData: Brand = {
            id: id,
            name: data.name,
            image: data.image,
            description: data.description,
            tagLine: data.tagLine,
            status: BrandStatus.ACTIVE,
            created_at: new Date(),
            updated_at: new Date()
        }

        await this.brandRepository.insert(brandData);
        return id;
    }

    async updateBrand(id: string, data: BrandUpdateDTO): Promise<void> {
        try {
            const brand = await this.brandRepository.getById(id);
            if (!brand) {
                throw new BrandNotFoundError(id);
            }
            if (brand.status === BrandStatus.DELETED) {
                throw new BrandAlreadyDeletedError(id);
            }

            await this.brandRepository.update(id, data);
        } catch (error) {
            if (error instanceof BrandNotFoundError || error instanceof BrandAlreadyDeletedError) {
                throw error;
            }
            throw new BrandNotFoundError(id);
        }
    }

    async deleteBrand(id: string): Promise<void> {
        try {
            const brand = await this.brandRepository.getById(id);
            if (!brand) {
                throw new BrandNotFoundError(id);
            }
            if (brand.status === BrandStatus.DELETED) {
                // Already deleted, return success (idempotent)
                return;
            }

            await this.brandRepository.delete(id);
        } catch (error) {
            if (error instanceof BrandNotFoundError) {
                throw error;
            }
            throw new BrandNotFoundError(id);
        }
    }

    async getDetailBrand(id: string): Promise<Brand> {
        try {
            const brand = await this.brandRepository.getById(id);
            if (!brand) {
                throw new BrandNotFoundError(id);
            }
            if (brand.status === BrandStatus.DELETED) {
                throw new BrandNotFoundError(id);
            }
            return brand;
        } catch (error) {
            if (error instanceof BrandNotFoundError) {
                throw error;
            }
            throw new BrandNotFoundError(id);
        }
    }

    async listBrand(pagination: Pagination, condition: BrandConditionDTO): Promise<{ brands: Brand[], pagination: Pagination }> {
        const result = await this.brandRepository.getAll(pagination, condition);
        return { brands: result.entities, pagination: result.pagination };
    }
}