
import { CreateCommand, DeleteCommand, IBrandRepository, UpdateCommand } from "../interface";
import { BrandAlreadyDeletedError, BrandAlreadyExistsError, BrandNotFoundError, BrandValidationError } from "../model/brand-error";
import { BrandCreateDTOSchema } from "../model/brand.dto";
import { Brand } from "../model/brand-model";
import { BrandStatus } from "../model/brand-enum";
import { ICreateNewBrandCommandHandler } from "../../../share/interface";

export class DeleteBrandCommandHandler implements ICreateNewBrandCommandHandler<DeleteCommand, void> {
    constructor(private readonly brandRepository: IBrandRepository) {
    }

    async execute(data: DeleteCommand): Promise<void> {
        try {
            const brand = await this.brandRepository.getById(data.id);
            if (!brand) {
                throw new BrandNotFoundError(data.id);
            }
            if (brand.status === BrandStatus.DELETED) {
                throw new BrandAlreadyDeletedError(data.id);
            }

            await this.brandRepository.delete(data.id);
            return;
        } catch (error) {
            if (error instanceof BrandNotFoundError || error instanceof BrandAlreadyDeletedError) {
                throw error;
            }
            throw new BrandNotFoundError(data.id);
        }
    }

} 