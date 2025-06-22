import { ProductConditionDTO, ProductCreateDTO, ProductUpdateDTO } from "@modules/product/model/product.dto";
import { Product } from "@modules/product/model/product-model";
import { BaseHttpService } from "@share/transport/http-service";
import { IBrandQueryRepository, IProductCategoryQueryRepository, IProductUseCase } from "@modules/product/interface";
import { Request, Response } from "express";


export class ProductHttpService extends BaseHttpService<Product, ProductCreateDTO, ProductUpdateDTO, ProductConditionDTO> {
    constructor(useCase: IProductUseCase,
        private readonly brandRepository: IBrandQueryRepository,
        private readonly categoryRepository: IProductCategoryQueryRepository) {
        super(useCase);
    }
    async getById(req: Request<{ id: string }>, res: Response) {
        try {
            const result = await this.useCase.getById(req.params.id);
            const brand = await this.brandRepository.get(result!.brandId!);
            if (!brand) {
                throw new Error("Brand not found");
            }
            const category = await this.categoryRepository.get(result!.categoryId!);
            if (!category) {
                throw new Error("Category not found");
            }
            result!.brand = brand!;
            result!.category = category!;
            res.status(200).json({ data: result });
        } catch (error) {
            res.status(500).json({ message: (error as Error).message });
        }
    }
}