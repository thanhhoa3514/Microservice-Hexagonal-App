import { Request, Response } from "express";
import { ICartQueryRepository, ICartUseCase } from "../../interface";
import { AppError, responseError } from "@share/app-error";
import axios from "axios";

export class CartHttpService {
    constructor(
        readonly cartUseCase: ICartUseCase,
    ) {
    }
    async addProductToCartAPI(req: Request, res: Response) {
        try {
            const requester = res.locals.requester;
            const { sub } = requester;
            const { productId, attribute, quantity } = req.body;
            const token = req.headers.authorization;
            if (token) {
                axios.defaults.headers.common["Authorization"] = token;
            }
            const result = await this.cartUseCase.addProductToCart({ userId: sub, productId, attribute, quantity });
            res.status(200).json({ message: "Product added to cart", data: result });
        } catch (error) {
            responseError(res, error as Error);
        }
    }
    async updateProductInCartAPI(req: Request, res: Response) {
        try {
            const requester = res.locals.requester;
            const { sub } = requester;
            const { productId, attribute, quantity } = req.body;
            const result = await this.cartUseCase.updateProductInCart({ userId: sub, productId, attribute, quantity });
            res.status(200).json({ message: "Product updated in cart", data: result });
        } catch (error) {
            AppError.from(error as Error, 500);
        }
    }
    async deleteProductFromCartAPI(req: Request, res: Response) {
        try {
            const requester = res.locals.requester;
            const { sub } = requester;
            const { productId } = req.body;
            const result = await this.cartUseCase.deleteProductFromCart({ userId: sub, productId });
            res.status(200).json({ message: "Product deleted from cart", data: result });
        } catch (error) {
            AppError.from(error as Error, 500);
        }
    }
    async getCartAPI(req: Request, res: Response) {
        try {
            const requester = res.locals.requester;
            const { sub } = requester;
            const token = req.headers.authorization;
            if (token) {
                axios.defaults.headers.common["Authorization"] = token;
            }
            const result = await this.cartUseCase.getCart(sub);
            res.status(200).json({ message: "Cart", data: result });
        } catch (error) {
            responseError(res, error as Error);
        }
    }
    async deleteProductAPI(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const result = await this.cartUseCase.deleteProduct(id);
            res.status(200).json({ message: "Product deleted", data: result });
        } catch (error) {
            responseError(res, error as Error);
        }
    }
    async listItemsGrpcAPI(req: Request, res: Response) {
        try {
            const { userId } = req.body;
            const result = await this.cartUseCase.getCart(userId);
            res.status(200).json({ message: "Items", data: result });
        } catch (error) {
            responseError(res, error as Error);
        }
    }
    async deleteProductGrpcAPI(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const result = await this.cartUseCase.deleteProduct(id);
            res.status(200).json({ message: "Product deleted", data: result });
        } catch (error) {
            responseError(res, error as Error);
        }
    }
}

