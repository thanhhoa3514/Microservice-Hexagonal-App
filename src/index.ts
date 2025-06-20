import { Request, Response } from "express";
import dotenv from "dotenv";
import { setUpCategoryAPIHex } from "./modules/category";
import { setUpBrandAPIHex } from "./modules/brand";
dotenv.config();
const express = require("express");
import { sequelize } from "./share/component/sequelize";
(async () => {
    await sequelize.authenticate();
    console.log("Database connected");
    const app = express();
    const port = process.env.PORT || 3000;
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use('/v1', await setUpCategoryAPIHex(sequelize));
    app.use('/v1', await setUpBrandAPIHex(sequelize));
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
})();
