import { Pagination } from "../../../share/model/paging";
import { IBrandUseCase, IBrandRepository } from "../interface";
import { BrandStatus } from "../model/brand-enum";
import { Brand } from "../model/brand-model";
import { BrandConditionDTO, BrandCreateDTO, BrandUpdateDTO, BrandCreateDTOSchema } from "../model/brand.dto";
import { BrandNotFoundError, BrandAlreadyDeletedError, BrandValidationError, BrandAlreadyExistsError } from "../model/brand-error";
import { v7 } from "uuid";

export class BrandUseCase implements IBrandUseCase {
    constructor(private readonly brandRepository: IBrandRepository) {
    }


    /**
     * Create a new brand
     * @param data - The data for the new brand
     * @returns The ID of the new brand
     */
    async createNewBrand(data: BrandCreateDTO): Promise<string> {
        return "123";
    }

    /**
     * Update a brand
     * @param id - The ID of the brand to update
     * @param data - The data to update the brand with
     */
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

    /**
     * Delete a brand
     * @param id - The ID of the brand to delete
     */
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

    /**
     * Get the detail of a brand
     * @param id - The ID of the brand to get the detail of
     * @returns The detail of the brand
     */
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

    /**
     * List all brands
     * @param pagination - The pagination information
     * @param condition - The condition to filter the brands
     * @returns The list of brands
     */
    async listBrand(pagination: Pagination, condition: BrandConditionDTO): Promise<{ brands: Brand[], pagination: Pagination }> {
        const result = await this.brandRepository.getAll(pagination, condition);
        return { brands: result.entities, pagination: result.pagination };
    }
}