import { Requester } from "@share/interface";
import { CartItem, Order, OrderUpdate, Product } from "../model/order.model";
import { Pagination } from "@share/model/paging";
import { OrderCondition, OrderCreate } from "../model/order.dto";


// use case

export interface IOrderUseCase {
    makeOrder(requester: Requester, order: OrderCreate): Promise<void>;
    updateOrder(requester: Requester, id: string, order: OrderUpdate): Promise<void>;
    deleteOrder(requester: Requester, id: string, isHard: boolean): Promise<void>;
    // getOrder(requester: Requester, id: string): Promise<Order>;
    // getOrders(requester: Requester, condition: OrderCondition): Promise<Order[]>;
    // getOrderItems(requester: Requester, orderId: string): Promise<OrderItem[]>;
    // getOrderItemsByProductId(requester: Requester, productId: string): Promise<OrderItem[]>;
    // getOrderItemsByUserId(requester: Requester, userId: string): Promise<OrderItem[]>;
    // getOrderItemsByOrderId(requester: Requester, orderId: string): Promise<OrderItem[]>;
    // getOrderItemsByProductIdAndUserId(requester: Requester, productId: string, userId: string): Promise<OrderItem[]>;
}

// repository
export interface IOrderQueryRepository {
    get(id: string): Promise<Order>;
    list(condition: OrderCondition, paging: Pagination): Promise<Order[]>;
    // getByUserId(userId: string): Promise<Order[]>;
    // getByCondition(condition: OrderCondition): Promise<Order[]>;
    // getOrderItems(orderId: string): Promise<OrderItem[]>;
    // getOrderItemsByProductId(productId: string): Promise<OrderItem[]>;
    // getOrderItemsByUserId(userId: string): Promise<OrderItem[]>;
    // getOrderItemsByOrderId(orderId: string): Promise<OrderItem[]>;
    // getOrderItemsByProductIdAndUserId(productId: string, userId: string): Promise<OrderItem[]>;
}

export interface IOrderCommandRepository {
    insert(order: Order): Promise<void>;
    update(id: string, order: OrderUpdate): Promise<void>;
    delete(id: string, isHard: boolean): Promise<void>;
    // insertOrderItems(orderItems: OrderItem[]): Promise<void>;
    // updateOrderItems(orderId: string, orderItems: OrderItem[]): Promise<void>;
    // deleteOrderItems(orderId: string, isHard: boolean): Promise<void>;
    // getOrderItems(orderId: string): Promise<OrderItem[]>;
    // getOrderItemsByProductId(productId: string): Promise<OrderItem[]>;
    // getOrderItemsByUserId(userId: string): Promise<OrderItem[]>;
}

// main repository
export interface IOrderRepository extends IOrderQueryRepository, IOrderCommandRepository {
}

// driven port
export interface ICartQueryRepository {
    listItems(userId: string): Promise<CartItem[]>;
    clearItems(userId: string): Promise<void>;
}

export interface IProductQueryRepository {
    findByIds(ids: string[]): Promise<Product[]>;
}