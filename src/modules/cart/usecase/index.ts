import { Pagination } from "@share/model/paging";
import { ICartCommandRepository, ICartQueryRepository, ICartUseCase, IProductQueryRepository } from "../interface";
import { AddCartItemDTO, AddCartItemDTOSchema, DeleteCartItemDTO, UpdateCartItemDTO, UpdateCartItemDTOSchema } from "../model/cart-dto";
import { CartItemDTO } from "../model/cart-model";
import { v7 } from "uuid";
import { CartProductNotFoundError, CartProductQuantityNotEnoughError } from "../model/cart-error";
import { AppError } from "@share/app-error";


export class CartUseCase implements ICartUseCase {
    constructor(
        readonly cartCommandRepository: ICartCommandRepository,
        readonly cartQueryRepository: ICartQueryRepository,
        readonly productQueryRepository: IProductQueryRepository,

    ) {
    }
    async deleteProduct(id: string): Promise<boolean> {
        const success: boolean = await this.cartCommandRepository.deleteHard(id);
        return success ? true : false;
    }
    async addProductToCart(data: AddCartItemDTO): Promise<boolean> {
        const dataDTO: AddCartItemDTO = AddCartItemDTOSchema.parse(data);
        const { userId, productId, attribute } = dataDTO;

        // check product exist

        const existProduct = await this.productQueryRepository.getBy(productId);

        if (!existProduct) {
            throw AppError.from(new CartProductNotFoundError(productId), 400);
        }
        if (existProduct.quantity < dataDTO.quantity) {
            throw AppError.from(new CartProductQuantityNotEnoughError(productId, dataDTO.quantity, existProduct.quantity), 400);
        }
        // check cart item exist
        const existCartItem = await this.cartQueryRepository.findByCondition({ userId, productId, attribute });
        if (existCartItem) {
            const newQuantity = existCartItem.quantity + dataDTO.quantity;
            const success: boolean = await this.cartCommandRepository.update({
                userId: dataDTO.userId,
                productId: dataDTO.productId,
                attribute: dataDTO.attribute,
                quantity: newQuantity,
            });
            return success ? true : false;
        }
        // add cart item
        const newId = v7();
        const newDataDTO = {
            id: newId,
            userId: dataDTO.userId,
            productId: dataDTO.productId,
            attribute: dataDTO.attribute,
            quantity: dataDTO.quantity,
            createdAt: new Date(),
            updatedAt: new Date(),
        }
        const success: boolean = await this.cartCommandRepository.insert(newDataDTO);
        return success ? true : false;

    }
    async updateProductInCart(data: UpdateCartItemDTO): Promise<boolean> {
        const dataDTO: UpdateCartItemDTO = UpdateCartItemDTOSchema.parse(data);
        const { userId, productId, attribute } = dataDTO;
        const existProduct = await this.cartQueryRepository.findByCondition({ userId, productId, attribute });
        if (!existProduct) {
            throw new Error("Product not found");
        }
        const success: boolean = await this.cartCommandRepository.update(dataDTO);
        return success ? true : false;
    }
    deleteProductFromCart(data: DeleteCartItemDTO): Promise<boolean> {
        throw new Error("Method not implemented.");
    }

    async getCart(userId: string): Promise<CartItemDTO[]> {
        const cartItems = await this.cartQueryRepository.listItem(userId);

        // Get all product IDs
        const productIds = cartItems.map(item => item.productId);

        // Fetch product data for all items
        const products = await this.productQueryRepository.getByIds(productIds);

        // Create Map for O(1) lookup instead of O(n) find()
        const productMap = new Map(products.map(p => [p.id, p]));

        // Map product data to cart items - O(n) instead of O(n²)
        return cartItems.map(item => ({
            ...item,
            product: productMap.get(item.productId)
        }));
    }
    async updateProductQuantities(data: UpdateCartItemDTO[], userId: string): Promise<boolean> {
        const dataDTO: UpdateCartItemDTO[] = data.map(item => UpdateCartItemDTOSchema.parse(item));
        const productIds = dataDTO.map(item => item.productId);
        const products = await this.productQueryRepository.getByIds(productIds);
        const productMap = new Map(products.map(p => [p.id, p.quantity]));
        const newDataDTO: UpdateCartItemDTO[] = dataDTO.map(item => {
            const productQuantity = productMap.get(item.productId);
            if (!productQuantity) {
                throw AppError.from(new CartProductNotFoundError(item.productId), 400);
            }
            this.checkProductQuantity(item.productId, item.quantity!, productQuantity);
            return {
                ...item,
                quantity: productQuantity
            }
        })
        const success: boolean = await this.cartCommandRepository.updateQuantity(newDataDTO, userId);
        return success ? true : false;
    }
    private checkProductQuantity(productId: string, quantity: number, productQuantity: number): boolean {
        if (productQuantity < quantity) {
            throw AppError.from(new CartProductQuantityNotEnoughError(productId, quantity, productQuantity), 400);
        }
        return true;
    }
}