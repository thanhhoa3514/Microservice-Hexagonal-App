import { Request, Response } from "express";
import { CreateCommand, IBrandUseCase, ICreateNewBrandCommandHandler } from "../../interface";

import { BrandCreateDTOSchema, BrandUpdateDTOSchema } from "../../model/brand.dto";
import { PaginationSchema } from "../../../../share/model/paging";

export class BrandHttpService {
    constructor(private readonly useCase: IBrandUseCase,
        private readonly createNewBrandCommandHandler: ICreateNewBrandCommandHandler<CreateCommand, string>) {

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
            await this.useCase.updateBrand(req.params.id, data);
            res.status(200).json({ message: "Brand updated successfully" });
        } catch (error) {
            res.status(500).json({ message: "Internal server error", error: error });
        }
    }
    async deleteAPI(req: Request, res: Response): Promise<void> {
        try {
            await this.useCase.deleteBrand(req.params.id);
            res.status(200).json({ message: "Brand deleted successfully" });
        } catch (error) {
            res.status(500).json({ message: "Internal server error", error: error });
        }
    }
    async getDetailAPI(req: Request, res: Response): Promise<void> {
        const brand = await this.useCase.getDetailBrand(req.params.id);
        res.status(200).json({ message: "Brand retrieved successfully", data: brand });

    }
    async listAPI(req: Request, res: Response): Promise<void> {
        try {
            const { success, data, error } = PaginationSchema.safeParse(req.query);

            if (!success) {
                res.status(400).json({ message: "Invalid request body", error: error.message });
                return;
            }
            const { brands, pagination } = await this.useCase.listBrand(data, req.query);
            res.status(200).json({ message: "Brand retrieved successfully", data: { brands, pagination } });
        } catch (error) {
            res.status(500).json({ message: "Internal server error", error: error });
        }
    }
}   
