import { Pagination } from "../../../share/model/paging";
import { ProductConditionDTO, ProductCreateDTO, ProductUpdateDTO } from "../model/product.dto";
import { Product } from "../model/product-model";
import { IRepository, IUseCase } from "../../../share/interface";

export interface IProductUseCase extends IUseCase<ProductCreateDTO, ProductUpdateDTO, Product, ProductConditionDTO> {

}

export interface CreateCommand {
    cmd: ProductCreateDTO;
}

export interface GetDetailProductQuery {
    id: string;
}
export interface UpdateCommand {
    id: string;
    cmd: ProductUpdateDTO;
}
export interface DeleteCommand {
    id: string;
    isSoftDelete?: boolean;
}
export interface ListProductQuery {
    pagination: Pagination;
    condition: ProductConditionDTO;
}

export interface IProductRepository extends IRepository<Product, ProductConditionDTO, ProductUpdateDTO> {
    findByCondition(condition: ProductConditionDTO): Promise<Product | null>;
}

