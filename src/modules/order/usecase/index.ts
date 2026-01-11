
import { Requester } from "@/share/interface";
import { IOrderQueryRepository, IOrderCommandRepository, IOrderUseCase, IProductQueryRepository, ICartQueryRepository } from "../interface";
import { Order, OrderItem, OrderUpdate, orderUpdateSchema } from "../model/order.model";
import { OrderCreate, orderCreateSchema } from "../model/order.dto";
import { v7 } from "uuid";
import { OrderPaymentMethod, OrderPaymentStatus, OrderStatus, ShippingMethod } from "../model/order.enum";


export class OrderUseCase implements IOrderUseCase {
    constructor(
        private readonly queryRepository: IOrderQueryRepository,
        private readonly commandRepository: IOrderCommandRepository,
        private readonly cartQueryRepository: ICartQueryRepository,
        private readonly productQueryRepository: IProductQueryRepository,
    ) { }
    async makeOrder(requester: Requester, order: OrderCreate): Promise<void> {
        const { sub: userId } = requester;
        order = orderCreateSchema.parse(order);
        const cartItems = await this.cartQueryRepository.listItems(userId);

        // check if product enough
        const productIds = cartItems.map(item => item.productId);
        const products = await this.productQueryRepository.findByIds(productIds);
        const productMap = new Map(products.map(product => [product.id, product.quantity]));
        for (const item of cartItems) {
            const product = productMap.get(item.productId);
            if (!product) {
                throw new Error(`Product ${item.productId} not found`);
            }
            if (product < item.quantity) {
                throw new Error(`Product ${item.productId} not enough`);
            }
        }

        const items: OrderItem[] = cartItems.map(item => ({
            id: v7(),
            orderId: newId,
            productId: item.productId,
            name: item.productName,
            attributes: item.attribute ? [item.attribute] : [],
            price: item.price,
            quantity: item.quantity,
        }));
        // create order
        const newId = v7();
        const orderNew: Order = {
            id: newId,
            ...order,
            userId, // Override any userId from order with requester's userId
            status: OrderStatus.PENDING,
            paymentMethod: OrderPaymentMethod.CASH_ON_DELIVERY,
            paymentStatus: OrderPaymentStatus.PENDING,
            trackingNumber: this.generateTrackingNumber(userId),
            shippingMethod: ShippingMethod.EXPRESS,
            items,
            createdAt: new Date(),
            updatedAt: new Date(),
        };
        const makeOrder = await this.commandRepository.insert(orderNew);
    }
    async updateOrder(requester: Requester, id: string, order: OrderUpdate): Promise<void> {
        const { sub: userId } = requester;
        const orderExist = await this.queryRepository.get(id);
        if (orderExist.userId !== userId) {
            throw new Error("You are not allowed to update this order");
        }
        order = orderUpdateSchema.parse(order);

        // check if the product in repository is enough to update quantity from user
        const productIds = order.items?.map(item => item.productId);
        if (productIds) {
            const products = await this.productQueryRepository.findByIds(productIds);
            const productMap = new Map(products.map(product => [product.id, product.quantity]));
            for (const item of order.items || []) {
                const product = productMap.get(item.productId);
                if (!product) {
                    throw new Error(`Product ${item.productId} not found`);
                }
                if (product < item.quantity) {
                    throw new Error(`Product ${item.productId} not enough`);
                }
            }
        }
        await this.commandRepository.update(id, order);
    }
    async deleteOrder(requester: Requester, id: string, isHard: boolean): Promise<void> {
        throw new Error("Method not implemented.");
    }

    private generateTrackingNumber(userId: string): string {
        const timestamp = Date.now().toString();
        const userHash = userId.slice(-4).toUpperCase();
        const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');

        return `TK${timestamp.slice(-6)}${userHash}${random}`;
        // Format: TK + 6 digit timestamp + 4 char user hash + 4 digit random
        // Example: TK123456A1B21234
    }
}