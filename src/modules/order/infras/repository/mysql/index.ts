import { IOrderCommandRepository, IOrderQueryRepository } from "@modules/order/interface";
import { OrderPaymentMethod, OrderPaymentStatus, OrderStatus, ShippingMethod } from "@modules/order/model/order.enum";
import { DataTypes, Model, Sequelize } from "sequelize";
import { Order, OrderUpdate } from "@modules/order/model/order.model";
import { Pagination } from "@/share/model/paging";
import { OrderCondition } from "@/modules/order/model/order.dto";


export class OrderPersistence extends Model { }
export class OrderItemPersistence extends Model { }

export const modelName = "Order";


export function init(sequelize: Sequelize) {
    OrderPersistence.init(
        {
            id: {
                type: DataTypes.STRING,
                primaryKey: true,
            },
            userId: {
                type: DataTypes.STRING,
                field: "user_id",
                allowNull: false,
            },
            shippingAddress: {
                type: DataTypes.STRING,
                field: "shipping_address",
                allowNull: false,
            },
            shippingCity: {
                type: DataTypes.STRING,
                field: "shipping_city",
                allowNull: false,
            },
            recipientFirstName: {
                type: DataTypes.STRING,
                field: "recipient_first_name",
                allowNull: false,
            },
            recipientLastName: {
                type: DataTypes.STRING,
                field: "recipient_last_name",
                allowNull: false,
            },
            recipientPhone: {
                type: DataTypes.STRING,
                field: "recipient_phone",
                allowNull: false,
            },
            recipientEmail: {
                type: DataTypes.STRING,
                field: "recipient_email",
                allowNull: false,
            },
            recipientNote: {
                type: DataTypes.STRING,
                field: "recipient_note",
                allowNull: false,
            },
            shippingMethod: {
                type: DataTypes.ENUM(...Object.values(ShippingMethod)),
                field: "shipping_method",
                allowNull: false,
            },
            paymentMethod: {
                type: DataTypes.ENUM(...Object.values(OrderPaymentMethod)),
                field: "payment_method",
                allowNull: false,
            },
            paymentStatus: {
                type: DataTypes.ENUM(...Object.values(OrderPaymentStatus)),
                field: "payment_status",
                allowNull: false,
            },
            trackingNumber: {
                type: DataTypes.STRING,
                field: "tracking_number",
                allowNull: false,
            },
            status: {
                type: DataTypes.ENUM(...Object.values(OrderStatus)),
                field: "status",
                allowNull: false,
            },
        },
        {
            sequelize,
            modelName: modelName,
            tableName: "orders",
            createdAt: "created_at",
            updatedAt: "updated_at",
            timestamps: true
        }
    );
    OrderItemPersistence.init(
        {
            id: {
                type: DataTypes.STRING,
                primaryKey: true,
            },
            orderId: {
                type: DataTypes.STRING,
                field: "order_id",
                allowNull: false,
            },
            productId: {
                type: DataTypes.STRING,
                field: "product_id",
                allowNull: false,
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            attribute: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            image: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            price: {
                type: DataTypes.FLOAT,
                allowNull: false,
            },
            quantity: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
        },
        {
            sequelize,
            modelName: "OrderItem",
            tableName: "order_items",
            createdAt: "created_at",
            updatedAt: "updated_at",
            timestamps: true
        },
    );
    OrderPersistence.hasMany(OrderItemPersistence, { foreignKey: { field: "order_id" }, as: 'items' });
}

export class OrderCommandRepository implements IOrderCommandRepository {
    constructor(private readonly sequelize: Sequelize) { }
    async insert(order: Order): Promise<void> {
        await this.sequelize.transaction(async (transaction) => {
            await OrderPersistence.create(order, { transaction });
            await OrderItemPersistence.bulkCreate(order.items, { transaction });
        });
        return;
    }
    async update(id: string, order: OrderUpdate): Promise<void> {
        await this.sequelize.models.Order.update(order, { where: { id } });
    }
    async delete(id: string, isHard: boolean): Promise<void> {
        await this.sequelize.models.Order.destroy({ where: { id } });
    }
}
export class OrderQueryRepository implements IOrderQueryRepository {
    constructor(private readonly sequelize: Sequelize) { }
    async get(id: string): Promise<Order> {
        const order = await OrderPersistence.findByPk(id);
        if (!order) {
            throw new Error("Order not found");
        }
        return order.toJSON() as unknown as Order;
    }
    async list(condition: OrderCondition, paging: Pagination): Promise<Order[]> {
        const orders = await OrderPersistence.findAll({ where: condition, offset: paging.page * paging.limit, limit: paging.limit });
        return orders.map(order => order.toJSON() as unknown as Order);
    }
}