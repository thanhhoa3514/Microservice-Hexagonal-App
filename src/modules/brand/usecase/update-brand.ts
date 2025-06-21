import { IBrandRepository, UpdateCommand } from "../interface";
import { BrandAlreadyDeletedError, BrandNotFoundError } from "../model/brand-error";

import { BrandStatus } from "../model/brand-enum";
import { ICreateNewBrandCommandHandler } from "../../../share/interface";

export class UpdateBrandCommandHandler implements ICreateNewBrandCommandHandler<UpdateCommand, void> {
    constructor(private readonly brandRepository: IBrandRepository) {
    }

    async execute(data: UpdateCommand): Promise<void> {
        try {
            const brand = await this.brandRepository.getById(data.id);
            if (!brand) {
                throw new BrandNotFoundError(data.id);
            }
            if (brand.status === BrandStatus.DELETED) {
                throw new BrandAlreadyDeletedError(data.id);
            }

            await this.brandRepository.update(data.id, data.cmd);
            return;
        } catch (error) {
            if (error instanceof BrandNotFoundError || error instanceof BrandAlreadyDeletedError) {
                throw error;
            }
            throw new BrandNotFoundError(data.id);
        }
    }

} 