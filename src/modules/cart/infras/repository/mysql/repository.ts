import { AddCartItemDTO, CartItemConditionDTO, DeleteCartItemDTO, UpdateCartItemDTO } from "../../../model/cart-dto";
import { CartItemDTO } from "../../../model/cart-model";
import { BaseCommandRepositorySequelize, BaseQueryRepositorySequelize, BaseRepositorySequelize } from "@share/repository/base-repos-sequelize";
import { Op, Sequelize } from "sequelize";
import { CartPersistence } from ".";
import { ICartCommandRepository, ICartQueryRepository } from "../../../interface";



export class CartRepositorySequelize implements ICartCommandRepository, ICartQueryRepository {
    constructor(
        readonly sequelize: Sequelize,
        readonly modelName: string,
    ) {
    }
    async insert(data: AddCartItemDTO): Promise<boolean> {
        const result = await CartPersistence.create(data);
        return result ? true : false;
    }

    async update(data: UpdateCartItemDTO): Promise<boolean> {
        const { quantity } = data;
        if (quantity <= 0) {
            throw new Error("Quantity must be greater than 0");
        }
        const getCartItem = await CartPersistence.findOne({
            where: {
                userId: data.userId,
                productId: data.productId,
                attribute: data.attribute,
            }
        });
        if (!getCartItem) {
            throw new Error("Cart item not found");
        }

        const result = await CartPersistence.update({
            ...data,
            quantity: quantity,
            updatedAt: new Date(),
        }, {
            where: {
                userId: data.userId,
                productId: data.productId,
            },
        });
        return result ? true : false;
    }

    async delete(data: DeleteCartItemDTO): Promise<boolean> {
        const result = await CartPersistence.destroy({
            where: {
                userId: data.userId,
                productId: data.productId,
            }
        });
        return result > 0;
    }
    async deleteHard(id: string): Promise<boolean> {
        const result = await CartPersistence.destroy({
            where: {
                id: id,
            }
        });
        return result ? true : false;
    }
    async listItem(userId: string): Promise<CartItemDTO[]> {
        const cart = await CartPersistence.findAll({
            where: { userId },
        });
        return cart.map((item) => item.get({ plain: true }));
    }

    async findByCondition(condition: CartItemConditionDTO): Promise<CartItemDTO | null> {
        const item = await CartPersistence.findOne({
            where: condition,
        });
        return item ? item.get({ plain: true }) : null;
    }
    async updateQuantity(data: UpdateCartItemDTO[], userId: string): Promise<boolean> {
        const result = await CartPersistence.update(data, {
            where: {
                userId: userId,
                productId: {
                    [Op.in]: data.map(item => item.productId)
                },
            }
        });
        return result ? true : false;
    }
}
