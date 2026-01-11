import { IOrderUseCase } from "@modules/order/interface";
import { OrderCreate, orderCreateSchema } from "@modules/order/model/order.dto";
import { OrderUpdate, orderUpdateSchema } from "@modules/order/model/order.model";
import { Requester } from "@share/interface";
import { Request, Response } from "express";

export class OrderHttpService {
    constructor(private readonly orderUseCase: IOrderUseCase) { }
    async makeOrderAPI(req: Request, res: Response): Promise<void> {
        const requester = res.locals.requester as Requester;
        const { order } = req.body;

        await this.orderUseCase.makeOrder(requester, order);
        res.status(201).json({ message: "Order created successfully" });
    }
    async updateOrderAPI(requester: Requester, id: string, order: OrderUpdate): Promise<void> {
        order = orderUpdateSchema.parse(order);
        await this.orderUseCase.updateOrder(requester, id, order);
    }
    async deleteOrderAPI(requester: Requester, id: string, isHard: boolean): Promise<void> {
        await this.orderUseCase.deleteOrder(requester, id, isHard);
    }
}