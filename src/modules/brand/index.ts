import { Router } from "express";

import { Sequelize } from "sequelize";
import { init } from "./infras/repository/sequelize/index";
import { BrandRepositorySequelize } from "./infras/repository/sequelize/brand-repos-sequelize";
import { BrandQueryRepositorySequelize } from "./infras/repository/sequelize/brand-query-repository";
import { BrandCommandRepositorySequelize } from "./infras/repository/sequelize/brand-command-repository";
import { BrandUseCase } from "./usecase";
import { BrandHttpService } from "./infras/transport/http-service";
import { CreateNewBrandCommandHandler } from "./usecase/create-new-brand";
import { GetBrandDetailQueryHandler } from "./usecase/get-brand-detail";
import { UpdateBrandCommandHandler } from "./usecase/update-brand";
import { DeleteBrandCommandHandler } from "./usecase/delete-brand";
import { ListBrandQueryHandler } from "./usecase/list-brand";

const router = Router();

export const setUpBrandAPIHex = async (sequelize: Sequelize) => {
    init(sequelize);

    // Create concrete repositories
    const brandQueryRepository = new BrandQueryRepositorySequelize(sequelize);
    const brandCommandRepository = new BrandCommandRepositorySequelize(sequelize);

    // Create main repository with composition
    const brandRepository = new BrandRepositorySequelize(brandCommandRepository, brandQueryRepository);
    const brandUseCase = new BrandUseCase(brandRepository);
    const createNewBrandCommandHandler = new CreateNewBrandCommandHandler(brandRepository);
    const getDetailBrandQueryHandler = new GetBrandDetailQueryHandler(brandRepository);
    const updateBrandCommandHandler = new UpdateBrandCommandHandler(brandRepository);
    const deleteBrandCommandHandler = new DeleteBrandCommandHandler(brandRepository);
    const listBrandQueryHandler = new ListBrandQueryHandler(brandRepository);
    const brandHttpService = new BrandHttpService(
        brandUseCase,
        createNewBrandCommandHandler,
        getDetailBrandQueryHandler,
        updateBrandCommandHandler,
        deleteBrandCommandHandler,
        listBrandQueryHandler
    );


    router.post("/brands", brandHttpService.createAPI.bind(brandHttpService));
    router.get("/brands", brandHttpService.listAPI.bind(brandHttpService));
    router.get("/brands/:id", brandHttpService.getDetailAPI.bind(brandHttpService));
    router.patch("/brands/:id", brandHttpService.updateAPI.bind(brandHttpService));
    router.delete("/brands/:id", brandHttpService.deleteAPI.bind(brandHttpService));

    router.post("/brands/rpc/find-all",
        brandHttpService.findAllAPI.bind(brandHttpService)
    );
    return router;
}