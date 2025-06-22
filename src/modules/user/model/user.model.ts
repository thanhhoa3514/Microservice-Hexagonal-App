import { z } from "zod";
import { Gender, Role, Status } from "./user.enum";

export const userModelName: string = "users";
export const UserDTOSchema = z.object({
    id: z.string().uuid(),
    avatar: z.string().url().nullable().optional(),
    firstName: z.string().min(2, { message: "First name must be at least 2 characters" }),
    lastName: z.string().min(2, { message: "Last name must be at least 2 characters" }),
    email: z.string().email(),
    password: z.string().min(8, { message: "Password must be at least 8 characters" }),
    salt: z.string().min(10, { message: "Salt must be at least 10 characters" }),
    phone: z.string().nullable().optional(),
    address: z.string().nullable().optional(),
    birthday: z.date().nullable().optional(),
    role: z.nativeEnum(Role),
    status: z.nativeEnum(Status),
    gender: z.nativeEnum(Gender),
    createdAt: z.date(),
    updatedAt: z.date(),

});
export type UserDTO = z.infer<typeof UserDTOSchema>;

export const UserRegistrationDTOSchema = UserDTOSchema.pick({
    firstName: true,
    lastName: true,
    email: true,
    password: true,
});
export type UserRegistrationDTO = z.infer<typeof UserRegistrationDTOSchema>;

export const UserLoginDTOSchema = UserDTOSchema.pick({
    email: true,
    password: true,
});
export type UserLoginDTO = z.infer<typeof UserLoginDTOSchema>;


const UserUpdateDTOSchema = z.object({
    id: z.string().uuid(),
    avatar: z.string().url().nullable().optional(),
    firstName: z.string().min(2, { message: "First name must be at least 2 characters" }).optional(),
    lastName: z.string().min(2, { message: "Last name must be at least 2 characters" }).optional(),
    password: z.string().min(8, { message: "Password must be at least 8 characters" }).optional(),
    salt: z.string().min(10, { message: "Salt must be at least 10 characters" }).optional(),
    phone: z.string().nullable().optional(),
    address: z.string().nullable().optional(),
    birthday: z.date().nullable().optional(),

    status: z.nativeEnum(Status).optional(),
    gender: z.nativeEnum(Gender).optional(),

});
export type UserUpdateDTO = z.infer<typeof UserUpdateDTOSchema>;


export const UserConditionDTOSchema = z.object({

    firstName: z.string().min(2, { message: "First name must be at least 2 characters" }).optional(),
    lastName: z.string().min(2, { message: "Last name must be at least 2 characters" }).optional(),
    email: z.string().email().optional(),
    phone: z.string().nullable().optional(),
    address: z.string().nullable().optional(),
    gender: z.nativeEnum(Gender).optional(),
    role: z.nativeEnum(Role).optional(),
    status: z.nativeEnum(Status).optional()
});
export type UserConditionDTO = z.infer<typeof UserConditionDTOSchema>;