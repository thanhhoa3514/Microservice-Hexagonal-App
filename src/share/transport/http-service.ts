import { Response, Request } from "express"
import { Pagination, PaginationSchema } from "@share/model/paging";
import { IUseCase } from "@share/interface";

export abstract class BaseHttpService<Entity, CreateDTO, UpdateDTO, Condition> {
    constructor(private readonly useCase: IUseCase<CreateDTO, UpdateDTO, Entity, Condition>) {

    }
    async create(req: Request<any, any, CreateDTO>, res: Response) {
        try {
            const result = await this.useCase.insert(req.body);
            res.status(201).json(result);
        } catch (error) {
            res.status(500).json({ message: (error as Error).message });
        }
    }
    async findAll(req: Request, res: Response) {
        try {
            const { success, data, error } = PaginationSchema.safeParse(req.query);

            if (!success) {
                res.status(400).json({ message: "Invalid request body", error: error.message });
                return;
            }
            const query: { pagination: Pagination, condition: Condition } = { pagination: data, condition: req.query as Condition };
            const { entities, pagination } = await this.useCase.execute(query);
            res.status(200).json({ message: "Brand retrieved successfully", data: { entities, pagination } });
        } catch (error) {
            res.status(500).json({ message: "Internal server error", error: error });
        }
    }
    async getById(req: Request, res: Response) {
        try {
            const result = await this.useCase.getById(req.params.id);
            res.status(200).json(result);
        } catch (error) {
            res.status(500).json({ message: (error as Error).message });
        }
    }
    async update(req: Request<any, any, UpdateDTO>, res: Response) {
        try {
            const result = await this.useCase.update(req.params.id, req.body);
            res.status(200).json(result);
        } catch (error) {
            res.status(500).json({ message: (error as Error).message });
        }
    }
    async delete(req: Request, res: Response) {
        try {
            const result = await this.useCase.delete(req.params.id);
            res.status(200).json(result);
        } catch (error) {
            res.status(500).json({ message: (error as Error).message });
        }
    }
}