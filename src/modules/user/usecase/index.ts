import { IRepository, UserToken } from "@share/interface";
import { IUserUseCase } from "../interface";
import { UserConditionDTO, UserDTO, UserLoginDTO, UserLoginDTOSchema, UserRegistrationDTO, UserRegistrationDTOSchema, UserUpdateDTO } from "../model/user.model";
import { Pagination } from "@share/model/paging";
import { v7 } from "uuid";
import { Gender, Role, Status } from "../model/user.enum";
import { UserAlreadyExistsError, UserInvalidPasswordError, UserInvalidTokenError, UserNotActiveError, UserNotFoundError } from "../model/user.error";
import { UserRepositoryMysql } from "../infras/repository/mysql/user.repo";
import bcrypt from "bcrypt";
import { JWTTokenServiceFactory } from "@share/component/jwt";


export class UserUseCase implements IUserUseCase {
    constructor(
        readonly userRepository: UserRepositoryMysql
    ) {
    }
    async profile(userId: string): Promise<UserDTO | null> {
        const user = await this.userRepository.getById(userId);
        return user;
    }
    async register(data: UserRegistrationDTO): Promise<string> {
        const dto = UserRegistrationDTOSchema.parse(data);
        const userExists: UserDTO | null = await this.userRepository.findByCondition({ email: dto.email });
        if (userExists) {
            throw new UserAlreadyExistsError(dto.email);
        }
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(dto.password, salt);
        const id = v7();
        const user: UserDTO = {
            id,
            ...dto,
            salt: salt,
            password: hash,
            status: Status.ACTIVE,
            role: Role.USER,
            gender: Gender.UNKNOWN,
            createdAt: new Date(),
            updatedAt: new Date()
        };
        await this.userRepository.insert(user);
        return id;
    }
    verify(token: string): Promise<void> {
        throw new Error("Method not implemented.");
    }

    async insert(data: UserRegistrationDTO): Promise<string> {
        return this.register(data);
    }

    async update(id: string, data: UserUpdateDTO): Promise<void> {
        return this.userRepository.update(id, data);
    }

    async delete(id: string): Promise<void> {
        return this.userRepository.delete(id);
    }

    async execute(query: { pagination: Pagination, condition: UserConditionDTO }): Promise<{ entities: UserDTO[], pagination: Pagination }> {
        return this.userRepository.getAll(query.pagination, query.condition);
    }

    async getById(id: string): Promise<UserDTO> {
        return this.userRepository.getById(id);
    }

    async login(data: UserLoginDTO): Promise<UserToken> {
        const dto = UserLoginDTOSchema.parse(data);
        const user: UserDTO | null = await this.userRepository.findByCondition({ email: dto.email });
        if (!user) {
            throw new UserNotFoundError(dto.email);
        }
        const isPasswordValid = await bcrypt.compare(dto.password, user.password);
        if (!isPasswordValid) {
            throw new UserInvalidPasswordError();
        }
        if (user.status !== Status.ACTIVE) {
            throw new UserNotActiveError();
        }
        const accessToken = await JWTTokenServiceFactory.generateToken({ sub: user.id, role: user.role });
        const refreshToken = await JWTTokenServiceFactory.generateRefreshToken({ sub: user.id, role: user.role });
        return { accessToken, refreshToken };
    }
}