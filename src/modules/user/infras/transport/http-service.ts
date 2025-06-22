import { BaseHttpService } from "@share/transport/http-service";
import { UserDTO, UserLoginDTOSchema, UserRegistrationDTO, UserUpdateDTO } from "@modules/user/model/user.model";
import { UserConditionDTO } from "@modules/user/model/user.model";
import { IUserUseCase } from "@modules/user/interface";
import { Request, Response } from "express";
import { JWTTokenServiceFactory } from "@share/component/jwt";
import { UserProfileDTO, UserProfileDTOSchema } from "../../model/user.dto";
import { json } from "sequelize";

export class UserHttpService extends BaseHttpService<UserDTO, UserRegistrationDTO, UserUpdateDTO, UserConditionDTO> {
    constructor(readonly userUseCase: IUserUseCase) {
        super(userUseCase);
    }
    async register(req: Request, res: Response): Promise<void> {
        return await this.insert(req, res);
    }
    async login(req: Request, res: Response): Promise<void> {
        try {
            const dto = UserLoginDTOSchema.parse(req.body);
            const result = await this.userUseCase.login(dto);
            res.status(200).json({
                message: "Login successful",
                data: result
            });
        } catch (error) {
            res.status(400).json({ message: (error as Error).message });
        }
    }
    async profile(req: Request, res: Response): Promise<void> {
        try {
            const token = req.headers.authorization?.split(" ")[1];
            if (!token) {
                res.status(401).json({ message: "Unauthorized: No token provided" });
                return;
            }

            const decoded = await JWTTokenServiceFactory.verifyToken(token);
            if (!decoded) {
                res.status(401).json({ message: "Unauthorized: Invalid or expired token" });
                return;
            }

            const result = await this.userUseCase.profile(decoded.sub);
            if (!result) {
                res.status(404).json({ message: "User not found" });
                return;
            }
            const transformedData = this.transformData(result);
            console.log(transformedData);
            if (!transformedData) {
                res.status(400).json({ message: "Invalid data" });
                return;
            }

            res.status(200).json({
                message: "Profile retrieved successfully",
                data: transformedData
            });
        } catch (error) {
            console.error('Profile endpoint error:', error);
            res.status(500).json({
                message: "Internal server error",
                error: (error as Error).message
            });
        }
    }
    private transformData(data: UserDTO): UserProfileDTO {
        try {
            return UserProfileDTOSchema.parse({
                id: data.id,
                firstName: data.firstName,
                lastName: data.lastName,
                phone: data.phone,
                address: data.address,
                birthday: data.birthday,
                gender: data.gender
            });
        } catch (error) {
            console.error('Transform error:', error);
            throw new Error("Invalid data transformation");
        }
    }
}