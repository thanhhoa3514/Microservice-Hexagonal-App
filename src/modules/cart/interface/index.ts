import { AddCartItemDTO, CartItemConditionDTO, DeleteCartItemDTO, UpdateCartItemDTO } from "../model/cart-dto";
import { CartItemDTO, CartProductDTO } from "../model/cart-model";

export const cartModelName: string = "carts";
export interface ICartUseCase {
    addProductToCart(data: AddCartItemDTO): Promise<boolean>;
    updateProductInCart(data: UpdateCartItemDTO): Promise<boolean>;
    deleteProductFromCart(data: DeleteCartItemDTO): Promise<boolean>;
    deleteProduct(id: string): Promise<boolean>;
    getCart(userId: string): Promise<CartItemDTO[]>;
    updateProductQuantities(data: UpdateCartItemDTO[], userId: string): Promise<boolean>;
}


export interface ICartQueryRepository {
    listItem(userId: string): Promise<CartItemDTO[]>;
    findByCondition(condition: CartItemConditionDTO): Promise<CartItemDTO | null>;
}
export interface ICartCommandRepository {
    insert(data: AddCartItemDTO): Promise<boolean>;
    update(data: UpdateCartItemDTO): Promise<boolean>;
    delete(data: DeleteCartItemDTO): Promise<boolean>;
    deleteHard(id: string): Promise<boolean>;
    updateQuantity(data: UpdateCartItemDTO[], userId: string): Promise<boolean>;
}

export interface IProductQueryRepository {
    getBy(id: string): Promise<CartProductDTO | null>;
    getByIds(ids: string[]): Promise<CartProductDTO[]>;
}
