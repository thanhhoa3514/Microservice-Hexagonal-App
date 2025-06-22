import "module-alias/register";
import { config } from "dotenv";
import { setUpCategoryAPIHex } from "@modules/category";
import { setUpBrandAPIHex } from "@modules/brand";
import { setUpProductAPIHex } from "@modules/product";
import { SetUpUserHexModule } from "@modules/user";
config();
const express = require("express");
import { sequelize } from "@share/component/sequelize";
(async () => {
    await sequelize.authenticate();
    console.log("Database connected");
    const app = express();
    const port = process.env.PORT || 3000;
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use('/v1', await setUpCategoryAPIHex(sequelize));
    app.use('/v1', await setUpBrandAPIHex(sequelize));
    app.use('/v1', await setUpProductAPIHex(sequelize));
    app.use('/v1', await SetUpUserHexModule(sequelize));
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
})();
