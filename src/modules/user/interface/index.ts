import { IUseCase, TokenIntrospectResult, UserToken } from "@share/interface";

import { UserConditionDTO, UserDTO, UserLoginDTO, UserRegistrationDTO, UserUpdateDTO } from "../model/user.model";

export interface IUserUseCase extends IUseCase<UserRegistrationDTO, UserUpdateDTO, UserDTO, UserConditionDTO> {
    login(data: UserLoginDTO): Promise<UserToken>;
    register(data: UserRegistrationDTO): Promise<string>;
    verify(token: string): Promise<TokenIntrospectResult>;
    profile(userId: string): Promise<UserDTO | null>;
    // findAll(condition: UserConditionDTO): Promise<UserDTO[]>;
    // findOne(id: string): Promise<UserDTO | null>;
    // findByEmail(email: string): Promise<UserDTO | null>;
    // findByPhone(phone: string): Promise<UserDTO | null>;
    // findByUsername(username: string): Promise<UserDTO | null>;
}