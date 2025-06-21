import { ProductConditionDTO, ProductCreateDTO, ProductUpdateDTO } from "@modules/product/model/product.dto";
import { Product } from "@modules/product/model/product-model";
import { BaseHttpService } from "@share/transport/http-service";
import { IProductUseCase } from "@modules/product/interface";

export class ProductHttpService extends BaseHttpService<Product, ProductCreateDTO, ProductUpdateDTO, ProductConditionDTO> {
    constructor(useCase: IProductUseCase) {
        super(useCase);
    }
}