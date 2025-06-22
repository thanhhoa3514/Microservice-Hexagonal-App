import { Request, Response } from "express";
import { CreateCommand, DeleteCommand, GetDetailBrandQuery, IBrandUseCase, ListBrandQuery, UpdateCommand } from "../../interface";

import { BrandCreateDTOSchema, BrandUpdateDTOSchema } from "../../model/brand.dto";
import { Pagination, PaginationSchema } from "@share/model/paging";
import { Brand } from "../../model/brand-model";
import { ICreateNewBrandCommandHandler, IQueryHandler } from "@share/interface";

export class BrandHttpService {
    constructor(private readonly useCase: IBrandUseCase,
        private readonly createNewBrandCommandHandler: ICreateNewBrandCommandHandler<CreateCommand, string>,
        private readonly getDetailBrandQueryHandler: IQueryHandler<GetDetailBrandQuery, Brand>,
        private readonly updateBrandCommandHandler: ICreateNewBrandCommandHandler<UpdateCommand, void>,
        private readonly deleteBrandCommandHandler: ICreateNewBrandCommandHandler<DeleteCommand, void>,
        private readonly listBrandQueryHandler: IQueryHandler<ListBrandQuery, { brands: Brand[], pagination: Pagination }>
    ) {

    }
    async createAPI(req: Request, res: Response): Promise<void> {

        const { success, data, error } = BrandCreateDTOSchema.safeParse(req.body);
        if (!success) {
            res.status(400).json({ message: "Invalid request body", error: error.message });
            return;
        }
        const cmd: CreateCommand = { cmd: data };
        const id = await this.createNewBrandCommandHandler.execute(cmd);
        res.status(201).json({ message: "Brand created successfully", data: { id } });


    }
    async updateAPI(req: Request, res: Response): Promise<void> {
        try {
            const { success, data, error } = BrandUpdateDTOSchema.safeParse(req.body);
            if (!success) {
                res.status(400).json({ message: "Invalid request body", error: error.message });
                return;
            }
            const cmd: UpdateCommand = { id: req.params.id, cmd: data };
            await this.updateBrandCommandHandler.execute(cmd);
            res.status(200).json({ message: "Brand updated successfully" });
        } catch (error) {
            res.status(500).json({ message: "Internal server error", error: error });
        }
    }
    async deleteAPI(req: Request, res: Response): Promise<void> {
        try {
            const cmd: DeleteCommand = { id: req.params.id };
            await this.deleteBrandCommandHandler.execute(cmd);
            res.status(200).json({ message: "Brand deleted successfully" });
        } catch (error) {
            res.status(500).json({ message: "Internal server error", error: error });
        }
    }
    async getDetailAPI(req: Request, res: Response): Promise<void> {
        try {

            const query: GetDetailBrandQuery = { id: req.params.id };
            const brand = await this.getDetailBrandQueryHandler.execute(query);
            res.status(200).json({ message: "Brand retrieved successfully", data: brand });
        } catch (error) {
            res.status(500).json({ message: "Internal server error", error: error });
        }

    }
    async listAPI(req: Request, res: Response): Promise<void> {
        try {
            const { success, data, error } = PaginationSchema.safeParse(req.query);

            if (!success) {
                res.status(400).json({ message: "Invalid request body", error: error.message });
                return;
            }
            const query: ListBrandQuery = { pagination: data, condition: req.query };
            const { brands, pagination } = await this.listBrandQueryHandler.execute(query);
            res.status(200).json({ message: "Brand retrieved successfully", data: { brands, pagination } });
        } catch (error) {
            res.status(500).json({ message: "Internal server error", error: error });
        }
    }
    async findAllAPI(req: Request, res: Response): Promise<void> {
        try {
            const { ids } = req.body;
            const data = await this.useCase.findAll(ids as string[]);
            if (data.length === 0) {
                res.status(404).json({ message: "Brand not found" });
                return;
            }
            res.status(200).json(data);
        } catch (error) {
            res.status(500).json({ message: "Internal server error", error: error });
        }
    }
}   
