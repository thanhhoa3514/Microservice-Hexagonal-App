import { OrderCondition } from "@modules/order/model/order.dto";
import { Order, OrderUpdate } from "@modules/order/model/order.model";
import { Pagination } from "@share/model/paging";
import { IOrderCommandRepository, IOrderQueryRepository, IOrderRepository } from "@modules/order/interface";


export class OrderMysqlRepository implements IOrderRepository {
    constructor(
        private readonly queryRepository: IOrderQueryRepository,
        private readonly commandRepository: IOrderCommandRepository,
    ) { }
    async get(id: string): Promise<Order> {
        return await this.queryRepository.get(id);
    }
    async list(condition: OrderCondition, paging: Pagination): Promise<Order[]> {
        return await this.queryRepository.list(condition, paging);
    }
    async insert(order: Order): Promise<void> {
        return await this.commandRepository.insert(order);
    }
    async update(id: string, order: OrderUpdate): Promise<void> {
        return await this.commandRepository.update(id, order);
    }
    async delete(id: string, isHard: boolean): Promise<void> {
        return await this.commandRepository.delete(id, isHard);
    }
}