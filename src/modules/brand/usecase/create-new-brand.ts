import { v7 } from "uuid";
import { CreateCommand, IBrandRepository } from "../interface";
import { BrandAlreadyExistsError, BrandValidationError } from "../model/brand-error";
import { BrandCreateDTOSchema } from "../model/brand.dto";
import { Brand } from "../model/brand-model";
import { BrandStatus } from "../model/brand-enum";
import { ICreateNewBrandCommandHandler } from "../../../share/interface";

export class CreateNewBrandCommandHandler implements ICreateNewBrandCommandHandler<CreateCommand, string> {
    constructor(private readonly brandRepository: IBrandRepository) {
    }

    async execute(data: CreateCommand): Promise<string> {
        // Validate the actual brand data (data.cmd)
        const validation = BrandCreateDTOSchema.safeParse(data.cmd);
        if (!validation.success) {
            throw new BrandValidationError("createData", data.cmd, validation.error.message);
        }

        // Check if brand with same name already exists
        const existingBrand = await this.brandRepository.findByCondition({ name: data.cmd.name });
        if (existingBrand) {
            throw new BrandAlreadyExistsError(data.cmd.name);
        }

        const id = v7();
        const brandData: Brand = {
            id: id,
            name: data.cmd.name,
            image: data.cmd.image,
            description: data.cmd.description,
            tagLine: data.cmd.tagLine,
            status: BrandStatus.ACTIVE,
            created_at: new Date(),
            updated_at: new Date()
        }

        await this.brandRepository.insert(brandData);
        return id;
    }

} 